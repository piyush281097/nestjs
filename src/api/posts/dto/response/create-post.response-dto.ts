import { ApiProperty } from '@nestjs/swagger';

export class CreatePostResponseDto {
  @ApiProperty()
  id: number;
}

export class UpdatePostResponseDto extends CreatePostResponseDto {}
