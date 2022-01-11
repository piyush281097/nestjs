import { ApiProperty } from '@nestjs/swagger';

export class CreateTradeResponseDto {
  @ApiProperty()
  id: number;
}

export class UpdateTradeResponseDto extends CreateTradeResponseDto {}
