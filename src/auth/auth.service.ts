import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/models/user.model';
import { IUser } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  async register(data: Pick<IUser, 'email' | 'password' | 'name'>) {
    const { email, password, name } = data;

    const existing = await this.userModel.findOne({ email });
    if (existing) throw new ConflictException('El email ya está registrado');

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ email, password: hashed, name });

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
