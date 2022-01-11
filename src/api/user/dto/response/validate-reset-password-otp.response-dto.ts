import { ApiProperty } from '@nestjs/swagger';

export class ValidateResetPasswordOtpResponseDto {
  @ApiProperty()
  message: string;
}
