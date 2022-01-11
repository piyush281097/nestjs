import { ApiProperty } from '@nestjs/swagger';

export class CreatedBy {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  userHandle: string;
}

export class TaggedAsset {
  @ApiProperty()
  logo: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  assetId: number;
}

export class TaggedUser {
  userId: number;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  userHandle: string;
}

export class MediaUrl {
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

export class ListAllTradesResponseDto {
  @ApiProperty()
  postId: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty({ type: TaggedAsset })
  taggedAssets: TaggedAsset;

  @ApiProperty({ type: [ProfileImage] })
  profileImage: ProfileImage;
}
