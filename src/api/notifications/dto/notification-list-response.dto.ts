import { ApiProperty } from '@nestjs/swagger';

export class NotificationListResponseDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  eventParentId: number;

  @ApiProperty()
  lastUpdated: number;
}
