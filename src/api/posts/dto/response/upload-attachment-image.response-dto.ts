import { ApiProperty } from '@nestjs/swagger';

export class UploadAttachmentImageResponseDto {
  @ApiProperty()
  uploadUrl: string;

  @ApiProperty()
  filePath: string;
}
