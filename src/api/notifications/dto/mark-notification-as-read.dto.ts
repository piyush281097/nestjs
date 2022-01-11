import { ApiProperty } from '@nestjs/swagger';

export class NotificationMarkAsReadRequestDto {
  @ApiProperty()
  type: string;

  @ApiProperty()
  eventParentId: number;
}
