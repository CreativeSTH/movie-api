import { Body, Controller, Post, Get, Query, UsePipes, UseGuards, Req } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { AuthService } from './auth.service';
import { registerSchema } from './schemas/register.schema';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { LoginDto, LoginDtoType } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklistService } from '../services/token-blacklist.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly blacklistService: TokenBlacklistService,
    private readonly jwtService: JwtService,) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(registerSchema))
  async register(@Body() body) {
    return this.authService.register(body);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const message = await this.authService.verifyEmailToken(token);
    return { message };
  }

  @Post('resend-verification')
  @UsePipes(new ZodValidationPipe(ResendVerificationDto))
  async resendVerification(@Body() body: any) {
    const { email } = body;
    return this.authService.resendVerificationEmail(email);
  }

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(LoginDto)) body: LoginDtoType
  ) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    const decoded = this.jwtService.decode(token) as any;
    const expiresAt = new Date(decoded.exp * 1000);

    await this.blacklistService.add(token, expiresAt);
    return { message: 'Sesión cerrada exitosamente.' };
  }
}
