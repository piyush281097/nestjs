import { ApiProperty } from '@nestjs/swagger';

export class GetRecentItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'For asset list' })
  symbol: string;

  @ApiProperty({ description: 'For user list' })
  userHandle: string;

  @ApiProperty({ description: 'For user list' })
  firstName: string;

  @ApiProperty({ description: 'For user list' })
  lastName: string;

  @ApiProperty({ description: 'For user list' })
  userId: number;
}
