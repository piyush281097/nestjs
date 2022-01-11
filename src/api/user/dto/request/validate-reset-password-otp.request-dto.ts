import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ValidateResetPasswordOtpRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  otp: number;
}
