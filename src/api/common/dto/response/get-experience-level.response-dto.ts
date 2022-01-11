import { ApiProperty } from '@nestjs/swagger';

export class GetExperienceLevelResponseDto {
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
}
