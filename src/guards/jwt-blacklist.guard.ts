import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenBlacklistService } from '../services/token-blacklist.service';

@Injectable()
export class JwtBlacklistGuard implements CanActivate {
  constructor(
    private readonly blacklistService: TokenBlacklistService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = (req.headers.authorization || '').replace('Bearer ', '');

    const isBlacklisted = await this.blacklistService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token inválido (en blacklist)');
    }

    return true;
  }
}
