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

export class ListAllPostsResponseDtoTemp {
  @ApiProperty()
  postId: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isLiked: boolean;

  @ApiProperty()
  likes: number;

  @ApiProperty({ type: CreatedBy })
  createdBy: CreatedBy;

  @ApiProperty({ type: [TaggedAsset] })
  taggedAssets: TaggedAsset[];

  @ApiProperty({ type: [TaggedUser] })
  taggedUsers: TaggedUser[];

  @ApiProperty({ type: [MediaUrl] })
  mediaUrl: MediaUrl[];

  @ApiProperty({ type: [ProfileImage] })
  profileImage: ProfileImage;
}

export class ListAllPostsResponseDto extends ListAllPostsResponseDtoTemp {
  @ApiProperty({ type: ListAllPostsResponseDtoTemp })
  postShared: ListAllPostsResponseDtoTemp;
}
