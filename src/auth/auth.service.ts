import { Injectable, BadRequestException, NotFoundException, UnauthorizedException  } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { User } from '../models/user.model';
import { VerificationToken } from '../models/verification-token.model';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailSender } from '../services/emailsender.service';
import { emailTemplates } from '../utils/emailTemplates';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(VerificationToken.name) private tokenModel: Model<VerificationToken>,
    private readonly emailSender: EmailSender,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { email, name, password } = createUserDto;

    // ✅ Verifica si el usuario ya existe
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // 🔒 Hashea la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧑‍💻 Crea el usuario
    const newUser = new this.userModel({
      email,
      name,
      password: hashedPassword,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // 🔐 Crea token de verificación
    const token = uuidv4();
    const expiresAt = addHours(new Date(), 24); // Válido por 24 horas

    await this.tokenModel.create({
      userId: savedUser._id,
      token,
      expiresAt,
    });

    // 📧 Envía email de verificación
    await this.emailSender.sendMail(
      savedUser.email,
      'Verifica tu cuenta',
      emailTemplates.verificationEmail(savedUser.name, token)
    );

    return savedUser;
  }

  async verifyEmailToken(token: string): Promise<string> {
    const tokenRecord = await this.tokenModel.findOne({ token });

    if (!tokenRecord) {
      throw new NotFoundException('Token inválido o no encontrado.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Token expirado.');
    }

    // Marca al usuario como verificado
    await this.userModel.findByIdAndUpdate(tokenRecord.userId, {
      isVerified: true,
    });

    // Elimina el token
    await this.tokenModel.deleteOne({ _id: tokenRecord._id });

    return 'Tu cuenta ha sido verificada exitosamente.';
  }

  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.isVerified) {
      throw new BadRequestException('Este correo ya fue verificado');
    }

    // Borrar tokens previos
    await this.tokenModel.deleteMany({ userId: user._id });

    const token = uuidv4();
    const expiresAt = addHours(new Date(), 24);

    await this.tokenModel.create({ userId: user._id, token, expiresAt });

    await this.emailSender.sendMail(
      user.email,
      'Verifica tu cuenta',
      emailTemplates.verificationEmail(user.name, token)
    );

    return { message: 'Correo de verificación reenviado con éxito' };
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    if (!user.isVerified) throw new UnauthorizedException('Cuenta no verificada');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: user._id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  }

}
