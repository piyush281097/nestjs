import { ApiProperty } from '@nestjs/swagger';

export class ResendOtpSignupResponseDto {
  @ApiProperty()
  otp: number;

  @ApiProperty()
  message: string;
}
