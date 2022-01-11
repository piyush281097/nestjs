import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccountOtpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty()
  otp: number;
}
