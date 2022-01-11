import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class UpdateLikeForPostParam {
  @Type(() => Number)
  @IsNumber()
  postId: number;

  @IsString()
  @IsIn(['like', 'unlike'])
  likeValue = 'like'; //Default value
}
