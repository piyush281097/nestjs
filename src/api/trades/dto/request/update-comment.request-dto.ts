import { PartialType } from '@nestjs/swagger';

import { AddCommentOnTradeRequestDto } from './add-comment.db-query';

export class UpdateCommentOnTradeRequestDto extends PartialType(
  AddCommentOnTradeRequestDto,
) {}
