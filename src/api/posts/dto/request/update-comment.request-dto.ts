import { PartialType } from '@nestjs/swagger';

import { AddCommentOnPostRequestDto } from './add-comment.db-query';

export class UpdateCommentOnPostRequestDto extends PartialType(
  AddCommentOnPostRequestDto,
) {}
