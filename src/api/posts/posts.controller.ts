import { number } from 'joi';
import { Observable } from 'rxjs';
import { AuthUser } from 'src/utils/decorator/user-token-payload.decorator';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { AddCommentOnPostRequestDto } from './dto/request/add-comment.db-query';
import { CreatePostRequestDto } from './dto/request/create-post.request-dto';
import { ListAllPostsQueryDto } from './dto/request/list-all-posts.query-dto';
import { ListCommentOnPostRequestDto } from './dto/request/list-comment.db-query';
import { UpdateCommentOnPostRequestDto } from './dto/request/update-comment.request-dto';
import { UpdateLikeForCommentOnPostParam } from './dto/request/update-like-for-comment.param-dto';
import { UpdateLikeForPostParam } from './dto/request/update-like-for-post.param-dto';
import { UpdatePostRequestDto } from './dto/request/update-post.request-dto';
import { UploadAttachmentImageRequestDto } from './dto/request/upload-attachment-image.request-dto';
import {
  CreatePostResponseDto,
  UpdatePostResponseDto,
} from './dto/response/create-post.response-dto';
import { LikesOfPostResponseDto } from './dto/response/likes-of-post.response-dto';
import { ListAllCommentsOnPostsResponseDto } from './dto/response/list-all-comments.response-dto';
import { ListAllPostsResponseDto } from './dto/response/list-all-post.response-dto';
import { UploadAttachmentImageResponseDto } from './dto/response/upload-attachment-image.response-dto';
import { PostsService } from './posts.service';

@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiTags('Posts')
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create POST',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreatePostRequestDto })
  @ApiResponse({ type: CreatePostResponseDto })
  create(
    @AuthUser() user: DecodedTokenPayload,
    @Body() createPostDto: CreatePostRequestDto,
  ) {
    return this.postsService.create(user.userId, createPostDto);
  }

  @ApiTags('Posts')
  @Get('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all posts in latest order of all users',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [ListAllPostsResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of posts to return' })
  @ApiQuery({
    name: 'filter',
    enum: ['all', 'one_day', 'one_week', 'one_month'],
  })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  findAllPosts(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
  ) {
    return this.postsService.findAll(user.userId, null, query);
  }

  @ApiTags('Posts')
  @Get(':userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all posts of any particular user or current logged in user',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [ListAllPostsResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of posts to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  @ApiQuery({
    name: 'filter',
    enum: ['all', 'one_day', 'one_week', 'one_month'],
  })
  findPostsOfAUser(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
    @Param('userId', ParseIntPipe) userId?: number,
  ) {
    return this.postsService.findAll(user.userId, userId ?? user.userId, query);
  }

  @ApiTags('Posts')
  @Patch(':postId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'PATCH a post',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: UpdatePostRequestDto })
  @ApiResponse({ type: UpdatePostResponseDto })
  UpdatePost(
    @AuthUser() user: DecodedTokenPayload,
    @Body() createPostDto: CreatePostRequestDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postsService.updatePost(user.userId, postId, createPostDto);
  }

  @ApiTags('Posts')
  @Delete(':postId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a post',
  })
  @ApiResponse({})
  remove(
    @AuthUser() user: DecodedTokenPayload,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postsService.deletePost(user.userId, postId);
  }

  @ApiTags('Posts')
  @Patch('/:postId/:likeValue')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'postId', type: number })
  @ApiParam({ name: 'likeValue', enum: ['like', 'unlike'] })
  @ApiOperation({
    summary: 'PATCH a post',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({})
  UpdatePostLike(
    @AuthUser() user: DecodedTokenPayload,
    @Param() param: UpdateLikeForPostParam,
  ) {
    const { likeValue, postId } = param;
    return this.postsService.updateLikeForPost(user.userId, postId, likeValue);
  }

  @ApiTags('Posts')
  @Get(':postId/likes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'get list of users who like the post',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [LikesOfPostResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of users to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  GetLikeDetailsOfPost(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postsService.getPostLikeUsers(postId, query);
  }

  @ApiTags('Posts')
  @Post('attachment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'This will generate presigned S3 URL for attachment pictures',
  })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({ type: UploadAttachmentImageRequestDto })
  @ApiResponse({ type: UploadAttachmentImageResponseDto })
  GetPreSignedUrlForAttachment(
    @AuthUser() user: DecodedTokenPayload,
    @Body() body: UploadAttachmentImageRequestDto,
  ): Observable<UploadAttachmentImageResponseDto> {
    return this.postsService.getPreSignedUrlForAttachment(
      body.fileName,
      user.userId,
    );
  }

  @ApiTags('Posts - Comment')
  @Post('/:postId/comment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'In order to add comment on a post',
  })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({ type: AddCommentOnPostRequestDto })
  @ApiResponse({})
  AddCommentOnPost(
    @AuthUser() user: DecodedTokenPayload,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: AddCommentOnPostRequestDto,
  ) {
    return this.postsService.addCommentOnPost(user.userId, postId, body);
  }

  @ApiTags('Posts - Comment')
  @Get('/:postId/comment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'This will generate presigned S3 URL for attachment pictures',
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'limit' })
  @ApiQuery({
    name: 'offset',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({ type: [ListAllCommentsOnPostsResponseDto] })
  @ApiResponse({})
  ListCommentOfAPost(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postsService.listCommentOfPost(postId, user.userId, query);
  }

  @ApiTags('Posts - Replies of Comment')
  @Get('/:postId/comment/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'This will generate presigned S3 URL for attachment pictures',
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'limit' })
  @ApiQuery({
    name: 'offset',
  })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiResponse({ type: [ListAllCommentsOnPostsResponseDto] })
  @ApiResponse({})
  ListRepliesOfCommentOfAPost(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.postsService.listCommentOfPost(
      postId,
      user.userId,
      query,
      commentId,
      true,
    );
  }

  @ApiTags('Posts - Comment')
  @Patch('/:postId/comment/:commentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'PATCH a comment',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: UpdatePostRequestDto })
  @ApiResponse({ type: UpdatePostResponseDto })
  UpdateCommentOnPost(
    @AuthUser() user: DecodedTokenPayload,
    @Body() createPostDto: UpdateCommentOnPostRequestDto,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.postsService.updateCommentOnPost(
      user.userId,
      commentId,
      postId,
      createPostDto,
    );
  }

  @ApiTags('Posts - Comment')
  @Delete('/:postId/comment/:commentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a comment on post',
  })
  @ApiResponse({})
  RemoveCommentOnPost(
    @AuthUser() user: DecodedTokenPayload,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.postsService.deleteCommentOnPost(
      user.userId,
      postId,
      commentId,
    );
  }

  @ApiTags('Posts - Comment')
  @Patch('/:postId/comment/:commentId/:likeValue')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'postId', type: number })
  @ApiParam({ name: 'commentId', type: number })
  @ApiParam({ name: 'likeValue', enum: ['like', 'unlike'] })
  @ApiOperation({
    summary: 'update a like for comment',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({})
  UpdateLikeForCommentOnPost(
    @AuthUser() user: DecodedTokenPayload,
    @Param() param: UpdateLikeForCommentOnPostParam,
  ) {
    const { likeValue, postId, commentId } = param;
    return this.postsService.updateLikeForCommentOnPost(
      user.userId,
      postId,
      commentId,
      likeValue,
    );
  }

  @ApiTags('Posts - Comment')
  @Get('/:postId/comment/:commentId/likes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'get list of users who like the post',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [LikesOfPostResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of users to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  GetLikesForCommentOnPost(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.postsService.getLikeForCommentOnPost(commentId, query);
  }

  @ApiTags('Posts - Get posts from tagged user/hashtag/trades')
  @Get('/:type/:value')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'get list of posts with Hashtag/User/Asset mentioned',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'type',
    description: 'Type of tagged type',
    enum: ['hashtag', 'user', 'asset'],
  })
  @ApiParam({
    name: 'value',
    description: 'Corresponding value of tagged type',
  })
  @ApiQuery({ name: 'limit', description: 'Number of users to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  ListAllPostsWithTaggedTypes(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
    @Param('type') type: string,
    @Param('value') value: string,
  ) {
    return this.postsService.getPostsWhichTagged(
      query,
      type,
      value,
      user.userId,
    );
  }
}
