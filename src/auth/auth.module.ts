import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from 'src/models/user.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VerificationToken, VerificationTokenSchema } from '../models/verification-token.model';
import { EmailModule } from '../services/email.module'; 
import { BlacklistedToken } from 'src/models/blacklisted-token.model';
import { BlacklistedTokenSchema } from 'src/models/blacklisted-token.model';
import { TokenBlacklistService } from 'src/services/token-blacklist.service';
import { JwtBlacklistGuard } from 'src/guards/jwt-blacklist.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default_jwt_secret',
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h' },
      }),
      inject: [ConfigService],
    }),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }, 
      { name: VerificationToken.name, schema: VerificationTokenSchema },
      { name: BlacklistedToken.name, schema: BlacklistedTokenSchema },
    ]),  
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,TokenBlacklistService,JwtBlacklistGuard],
})
export class AuthModule {}
