import { AuthUser } from 'src/utils/decorator/user-token-payload.decorator';

import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { ListAllPostsQueryDto } from '../posts/dto/request/list-all-posts.query-dto';
import { ListAllPostsResponseDto } from '../posts/dto/response/list-all-post.response-dto';
import { BookmarkService } from './bookmark.service';

@Controller({
  path: 'bookmark',
  version: '1',
})
@ApiTags('BookMark')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post(':postId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'bookmark a post',
  })
  @ApiBody({})
  @ApiResponse({})
  create(
    @AuthUser() user: DecodedTokenPayload,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.bookmarkService.createPostsBookmark(user.userId, postId);
  }

  @Get('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all saved bookmark of posts in latest order',
  })
  @ApiResponse({ type: [ListAllPostsResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of posts to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  findAllPosts(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
  ) {
    return this.bookmarkService.listAllBookmarkedPosts(user.userId, query);
  }

  @Delete(':postId')
  @ApiOperation({
    summary: 'Delete a saved post (bookmark)',
  })
  @ApiResponse({})
  remove(
    @AuthUser() user: DecodedTokenPayload,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.bookmarkService.DeletePostsBookmark(user.userId, postId);
  }
}
