import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistedToken } from '../models/blacklisted-token.model';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectModel(BlacklistedToken.name)
    private readonly blacklistModel: Model<BlacklistedToken>,
  ) {}

  async add(token: string, expiresAt: Date) {
    return await this.blacklistModel.create({ token, expiresAt });
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const exists = await this.blacklistModel.findOne({ token });
    return !!exists;
  }
}
