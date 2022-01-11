import { ApiProperty } from '@nestjs/swagger';

export class ProfileImage {
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
}
export class SearchUsersResponseDto {
  @ApiProperty()
  userHandle: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  profileImage: ProfileImage;
}
