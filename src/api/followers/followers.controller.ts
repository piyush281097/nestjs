import { AuthUser } from 'src/utils/decorator/user-token-payload.decorator';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { FollowArrayOfUsersDto } from './dto/request/follow-array-of-users.request-dto';
import { ListAllFollowersQueryDto } from './dto/request/list-all-followers.query-dto';
import { ListOfFollowersDto } from './dto/response/list-of-follower.request';
import { FollowersService } from './followers.service';

@Controller({
  path: 'followers',
  version: '1',
})
@ApiTags('Followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get list of followers and Following loggedIn user',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: ListOfFollowersDto })
  @ApiQuery({ name: 'limit', description: 'Number of posts to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  findAll(
    @AuthUser() user: DecodedTokenPayload,
    @Query() query: ListAllFollowersQueryDto,
  ) {
    return this.followersService.getAllFollowers(user.userId, query);
  }

  @Get('list/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get list of followers and Following other users',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: ListOfFollowersDto })
  @ApiQuery({ name: 'limit', description: 'Number of posts to return' })
  @ApiQuery({
    name: 'offset',
    description: 'From which post to get n-limit posts',
  })
  ListAllFollowersOfNonLoggedInUser(
    @AuthUser() user: DecodedTokenPayload,
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: ListAllFollowersQueryDto,
  ) {
    return this.followersService.getAllFollowers(userId, query);
  }

  @Patch('list/:followType')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Follow a List of Users',
  })
  @ApiParam({ name: 'followType', enum: ['follow', 'unfollow'] })
  @ApiBody({ type: FollowArrayOfUsersDto })
  @UsePipes(new ValidationPipe())
  @ApiResponse({})
  FollowListOfUsers(
    @AuthUser() user: DecodedTokenPayload,
    @Body() body: FollowArrayOfUsersDto,
    @Param('followType') followType: string,
  ) {
    return this.followersService.followListOfUsers(
      user.userId,
      body.userIds,
      followType,
    );
  }

  @Patch(':userId/:followType')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Follow a User',
  })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'followType', enum: ['follow', 'unfollow'] })
  @UsePipes(new ValidationPipe())
  @ApiResponse({})
  FollowUser(
    @AuthUser() user: DecodedTokenPayload,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('followType') followType: string,
  ) {
    return this.followersService.followUser(user.userId, userId, followType);
  }

  @Delete(':userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Remove a user from following loggedIn user',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({})
  RemoveAUserFollowing(
    @AuthUser() user: DecodedTokenPayload,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.followersService.RemoveAFollowingUser(user.userId, userId);
  }
}
