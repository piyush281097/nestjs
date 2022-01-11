import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsString } from 'class-validator';

export class UpdateLikeForCommentOnPostParam {
  @Type(() => Number)
  @IsNumber()
  postId: number;

  @Type(() => Number)
  @IsNumber()
  commentId: number;

  @IsString()
  @IsIn(['like', 'unlike'])
  likeValue = 'like'; //Default value
}
