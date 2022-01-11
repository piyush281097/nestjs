import { ArrayUnique, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class FollowArrayOfUsersDto {
  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @ArrayUnique((o: any) => o)
  userIds: number[];
}
