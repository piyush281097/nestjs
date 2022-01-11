import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class UpdateLikeForTradeParam {
  @Type(() => Number)
  @IsNumber()
  tradeId: number;

  @IsString()
  @IsIn(['like', 'unlike'])
  likeValue = 'like'; //Default value
}
