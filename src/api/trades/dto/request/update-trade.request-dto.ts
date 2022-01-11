import { PartialType } from '@nestjs/swagger';

import { CreateTradeRequestDto } from './create-trade.request-dto';

export class UpdateTradeRequestDto extends PartialType(CreateTradeRequestDto) {}
