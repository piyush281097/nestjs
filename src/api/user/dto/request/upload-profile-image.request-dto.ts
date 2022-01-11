import { IsNotEmpty } from 'class-validator';
import { IMAGE_FILE_EXTENSIONS } from 'src/shared/constants';

import { ApiProperty } from '@nestjs/swagger';

import { IsValidExtension } from '../../../../utils/decorator/is-valid-extension.decorator';

export class UploadProfileImageRequestDto {
  @IsValidExtension(IMAGE_FILE_EXTENSIONS)
  @IsNotEmpty()
  @ApiProperty()
  fileName: string;
}
