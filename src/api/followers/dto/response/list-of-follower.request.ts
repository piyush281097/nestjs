import { ApiProperty } from '@nestjs/swagger';

export class UserFollowDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  userHandle: string;
}

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

export class ListOfFollowersDto {
  @ApiProperty({ type: [UserFollowDto] })
  following: UserFollowDto[];

  @ApiProperty({ type: [UserFollowDto] })
  followers: UserFollowDto[];

  @ApiProperty()
  profileImage: ProfileImage;
}
