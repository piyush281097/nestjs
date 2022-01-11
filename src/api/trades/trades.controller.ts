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
import { ListAllPostsQueryDto } from '../posts/dto/request/list-all-posts.query-dto';
import { AddCommentOnTradeRequestDto } from './dto/request/add-comment.db-query';
import { CreateTradeRequestDto } from './dto/request/create-trade.request-dto';
import { ListAllTradesQueryDto } from './dto/request/list-all-trades.query-dto';
import { UpdateCommentOnTradeRequestDto } from './dto/request/update-comment.request-dto';
import { UpdateLikeForCommentOnTradeParam } from './dto/request/update-like-for-comment.param-dto';
import { UpdateLikeForTradeParam } from './dto/request/update-like-for-trade.param-dto';
import { UpdateTradeRequestDto } from './dto/request/update-trade.request-dto';
import {
  CreateTradeResponseDto,
  UpdateTradeResponseDto,
} from './dto/response/create-trade.response-dto';
import { LikesOfTradesResponseDto } from './dto/response/likes-of-post.response-dto';
import { ListAllCommentsOnTradesResponseDto } from './dto/response/list-all-comments.response-dto';
import { ListAllTradesResponseDto } from './dto/response/list-all-trades.response-dto';
import { TradesService } from './trades.service';

@Controller({
  path: 'trades',
  version: '1',
})
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @ApiTags('Trades')
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create POST',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: CreateTradeRequestDto })
  @ApiResponse({ type: CreateTradeResponseDto })
  create(
    @AuthUser() user: DecodedTokenPayload,
    @Body() createTradeDto: CreateTradeRequestDto,
  ) {
    return this.tradesService.create(user.userId, createTradeDto);
  }

  @ApiTags('Trades')
  @Get('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all trades in latest order of all users',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [ListAllTradesResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of trades to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which trade to get n-limit trades',
  })
  @ApiQuery({
    name: 'filter',
    enum: ['all', 'one_day', 'one_week', 'one_month'],
  })
  findAllTrades(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllTradesQueryDto,
  ) {
    return this.tradesService.findAll(user.userId, null, query);
  }

  @ApiTags('Trades')
  @Get(':userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all trades of any particular user or current logged in user',
  })
  @ApiQuery({
    name: 'filter',
    enum: ['all', 'one_day', 'one_week', 'one_month'],
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [ListAllTradesResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of trades to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which trade to get n-limit trades',
  })
  findTradesOfAUser(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllTradesQueryDto,
    @Param('userId', ParseIntPipe) userId?: number,
  ) {
    return this.tradesService.findAll(
      user.userId,
      userId ?? user.userId,
      query,
    );
  }

  @ApiTags('Trades')
  @Patch(':tradeId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'PATCH a trade',
  })
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @ApiBody({ type: UpdateTradeRequestDto })
  @ApiResponse({ type: UpdateTradeResponseDto })
  UpdateTrade(
    @AuthUser() user: DecodedTokenPayload,
    @Body() createTradeDto: CreateTradeRequestDto,
    @Param('tradeId', ParseIntPipe) tradeId: number,
  ) {
    return this.tradesService.updateTrade(user.userId, tradeId, createTradeDto);
  }

  @ApiTags('Trades')
  @Delete(':tradeId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a trade',
  })
  @ApiResponse({})
  remove(
    @AuthUser() user: DecodedTokenPayload,
    @Param('tradeId', ParseIntPipe) tradeId: number,
  ) {
    return this.tradesService.deleteTrade(user.userId, tradeId);
  }

  @ApiTags('Trades')
  @Patch('/:tradeId/:likeValue')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'tradeId', type: Number })
  @ApiParam({ name: 'likeValue', enum: ['like', 'unlike'] })
  @ApiOperation({
    summary: 'Add like for a trade',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({})
  UpdateTradeLike(
    @AuthUser() user: DecodedTokenPayload,
    @Param() param: UpdateLikeForTradeParam,
  ) {
    const { likeValue, tradeId } = param;
    return this.tradesService.updateLikeForTrade(
      user.userId,
      tradeId,
      likeValue,
    );
  }

  @ApiTags('Trades')
  @Get(':tradeId/likes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'get list of users who like the trade',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [LikesOfTradesResponseDto] })
  @ApiQuery({ name: 'limit', description: 'Number of users to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which trade to get n-limit trades',
  })
  GetLikeDetailsOfTrade(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllTradesQueryDto,
    @Param('tradeId', ParseIntPipe) tradeId: number,
  ) {
    return this.tradesService.getTradeLikeUsers(tradeId, query);
  }

  @ApiTags('Trades - Comment')
  @Post('/:tradeId/comment')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'In order to add comment on a trade',
  })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({ type: AddCommentOnTradeRequestDto })
  @ApiResponse({})
  AddCommentOnTrade(
    @AuthUser() user: DecodedTokenPayload,
    @Param('tradeId', ParseIntPipe) tradeId: number,
    @Body() body: AddCommentOnTradeRequestDto,
  ) {
    return this.tradesService.addCommentOnTrade(user.userId, tradeId, body);
  }

  @ApiTags('Trades - Comment')
  @Get('/:tradeId/comment')
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
  @ApiResponse({ type: [ListAllCommentsOnTradesResponseDto] })
  @ApiResponse({})
  ListCommentOfATrade(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllTradesQueryDto,
    @Param('tradeId', ParseIntPipe) tradeId: number,
  ) {
    return this.tradesService.listCommentOfTrade(tradeId, user.userId, query);
  }

  @ApiTags('Trades - Replies of Comment')
  @Get('/:tradeId/comment/:commentId')
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
  @ApiResponse({ type: [ListAllCommentsOnTradesResponseDto] })
  @ApiResponse({})
  ListRepliesOfCommentOfATrade(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllTradesQueryDto,
    @Param('tradeId', ParseIntPipe) tradeId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.tradesService.listCommentOfTrade(
      tradeId,
      user.userId,
      query,
      commentId,
      true,
    );
  }

  @ApiTags('Trades - Comment')
  @Patch('/:tradeId/comment/:commentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'PATCH a comment',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: UpdateTradeRequestDto })
  @ApiResponse({ type: UpdateTradeResponseDto })
  UpdateCommentOnTrade(
    @AuthUser() user: DecodedTokenPayload,
    @Body() createTradeDto: UpdateCommentOnTradeRequestDto,
    @Param('tradeId', ParseIntPipe) tradeId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.tradesService.updateCommentOnTrade(
      user.userId,
      commentId,
      tradeId,
      createTradeDto,
    );
  }

  @ApiTags('Trades - Comment')
  @Delete('/:tradeId/comment/:commentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a comment on trade',
  })
  @ApiResponse({})
  RemoveCommentOnTrade(
    @AuthUser() user: DecodedTokenPayload,
    @Param('tradeId', ParseIntPipe) tradeId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.tradesService.deleteCommentOnTrade(
      user.userId,
      tradeId,
      commentId,
    );
  }

  @ApiTags('Trades - Comment')
  @Patch('/:tradeId/comment/:commentId/:likeValue')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'tradeId', type: Number })
  @ApiParam({ name: 'commentId', type: Number })
  @ApiParam({ name: 'likeValue', enum: ['like', 'unlike'] })
  @ApiOperation({
    summary: 'update a like for comment',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({})
  UpdateLikeForCommentOnTrade(
    @AuthUser() user: DecodedTokenPayload,
    @Param() param: UpdateLikeForCommentOnTradeParam,
  ) {
    const { likeValue, tradeId, commentId } = param;
    return this.tradesService.updateLikeForCommentOnTrade(
      user.userId,
      tradeId,
      commentId,
      likeValue,
    );
  }

  @ApiTags('Trades - Comment')
  @Get('/:tradeId/comment/:commentId/likes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'get list of users who like the trade',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [UpdateLikeForCommentOnTradeParam] })
  @ApiQuery({ name: 'limit', description: 'Number of users to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which trade to get n-limit trades',
  })
  GetLikesForCommentOnTrade(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllTradesQueryDto,
    @Param('tradeId', ParseIntPipe) tradeId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return this.tradesService.getLikeForCommentOnTrade(commentId, query);
  }

  @ApiTags('Trades - Get trades from tagged Asset')
  @Get('/asset/:value')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'get list of Trades with Asset tagged',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiParam({
    name: 'value',
    description: 'Corresponding symbol of tagged asset',
  })
  @ApiQuery({ name: 'limit', description: 'Number of users to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  ListAllTradesWithTaggedAsset(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllPostsQueryDto,
    @Param('value') value: string,
  ) {
    return this.tradesService.getPostsWhichTagged(query, user.userId, value);
  }
}
