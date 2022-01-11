import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty()
  message: string;
}
