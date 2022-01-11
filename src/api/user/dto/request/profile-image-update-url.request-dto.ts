import { IsNotEmpty, IsUrl } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class ProfileImageUpdateUrlRequestDto {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty()
  filePath: string;
}
