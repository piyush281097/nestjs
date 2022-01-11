import { OmitType } from '@nestjs/swagger';

export class GetUserByEmailDbDto {
  id: number;
  email: string;
  password: string;
  passwordSalt: string;
  isVerified: string;
  isActive: string;
  userHandle: string;
  countryCode: string;
  mobileNumber: string;
  isDeleted: string;
  createdAt: string;
  lastUpdated: string;
  userId: number;
  firstName: string;
  lastName: number;
  quote: string;
  about: string;
  goal: string;
  isSocialLogin: boolean;
}

export class GetUserByEmailWithPassword extends OmitType(GetUserByEmailDbDto, [
  'password',
  'passwordSalt',
] as const) {}
