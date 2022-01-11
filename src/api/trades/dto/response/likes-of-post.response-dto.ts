import { ApiProperty } from '@nestjs/swagger';

export class ProfileImage {
  @ApiProperty()
  imageOrg: string;

  @ApiProperty()
  imageLarge: string;

  @ApiProperty()
  imageSmall: string;

  @ApiProperty()
  imageThumb: string;

  @ApiProperty()
  imageMedium: string;
}

export class LikesOfTradesResponseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  userHandle: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  profileImage: ProfileImage;
}
