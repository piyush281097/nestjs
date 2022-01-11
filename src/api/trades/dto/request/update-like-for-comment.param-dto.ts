import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class UpdateLikeForCommentOnTradeParam {
  @Type(() => Number)
  @IsNumber()
  tradeId: number;

  @Type(() => Number)
  @IsNumber()
  commentId: number;

  @IsString()
  @IsIn(['like', 'unlike'])
  likeValue = 'like'; //Default value
}
