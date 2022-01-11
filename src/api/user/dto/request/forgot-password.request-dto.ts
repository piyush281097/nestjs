import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  username: string;
}
