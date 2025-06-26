import { Types } from 'mongoose';

export interface IUser {
  _id?: string | Types.ObjectId;
  email: string;
  password: string;
  name: string;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}