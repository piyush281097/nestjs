import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  otp: number;
}
