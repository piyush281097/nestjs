import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpSignupRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  username: string;
}
