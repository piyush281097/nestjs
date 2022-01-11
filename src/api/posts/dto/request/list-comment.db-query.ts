import { ApiProperty } from '@nestjs/swagger';

export class ListCommentOnPostRequestDto {
  @ApiProperty()
  comment: string;
}
