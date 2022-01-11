import { ApiProperty } from '@nestjs/swagger';

export class ProfileImageUpdateUrlResponseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  imageOrg: string;

  @ApiProperty()
  imageThumb: string;

  @ApiProperty()
  imageSmall: string;

  @ApiProperty()
  imageMedium: string;

  @ApiProperty()
  imageLarge: string;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastUpdated: Date;
}
