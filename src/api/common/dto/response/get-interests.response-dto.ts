import { ApiProperty } from '@nestjs/swagger';

export class GetInterestsResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  isDeleted: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastUpdated: Date;

  @ApiProperty()
  imageUrl: string;
}
