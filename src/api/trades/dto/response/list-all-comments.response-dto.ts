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

export class ListAllCommentsOnTradesResponseDtoTemp {
  @ApiProperty()
  tradeId: number;

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
}

export class ListAllCommentsOnTradesResponseDto extends ListAllCommentsOnTradesResponseDtoTemp {
  @ApiProperty({ type: [ListAllCommentsOnTradesResponseDtoTemp] })
  replies: ListAllCommentsOnTradesResponseDtoTemp[];
}
