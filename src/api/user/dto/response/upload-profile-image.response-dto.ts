import { ApiProperty } from '@nestjs/swagger';

export class UploadProfileImageResponseDto {
  @ApiProperty()
  uploadUrl: string;

  @ApiProperty()
  filePath: string;
}
