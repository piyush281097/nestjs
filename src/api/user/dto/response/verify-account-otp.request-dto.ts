import { ApiProperty } from '@nestjs/swagger';

export class VerifyAccountOtpResponseDto {
  @ApiProperty()
  message: string;
}
