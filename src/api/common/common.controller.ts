import { AuthUser } from 'src/utils/decorator/user-token-payload.decorator';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { CommonService } from './common.service';
import {
  AddRecentSearchRequestDto,
  listRecentSearchItemDto,
} from './dto/request/add-recent-search-history.request-dto';
import { ListAllHashtagsQueryDto } from './dto/request/list-hashtags.request-dto';
import { GetInterestsResponseDto } from './dto/response/get-interests.response-dto';
import { GetRecentItemResponse } from './dto/response/get-recent-item.response-dto';

@Controller({
  path: 'common',
  version: '1',
})
@ApiTags('Common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('interests')
  @ApiResponse({ type: [GetInterestsResponseDto] })
  GetAllInterests() {
    return this.commonService.getAllInterests();
  }

  @Get('experience-level')
  @ApiResponse({ type: [GetInterestsResponseDto] })
  GetAllExperienceLevel() {
    return this.commonService.getAllExperienceLevel();
  }

  @Get('investment-styles')
  @ApiResponse({ type: [GetInterestsResponseDto] })
  GetAllInvestmentStyles() {
    return this.commonService.getAllInvestStyles();
  }

  @Get('hashtags')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Follow a User',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [GetInterestsResponseDto] })
  GetAllHashtags(@Query() queryVal: ListAllHashtagsQueryDto) {
    const { limit, offset, query } = queryVal;
    return this.commonService.getAllHashtags(limit, offset, query);
  }

  @Post('recent-search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Add recent search user or asset',
  })
  @ApiBody({ type: AddRecentSearchRequestDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({})
  AddRecentSearchUser(
    @AuthUser() user: DecodedTokenPayload,
    @Body() body: AddRecentSearchRequestDto,
  ) {
    return this.commonService.addRecentSearchUser(user.userId, body);
  }

  @Get('recent-search/:type')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get recent searches',
  })
  @ApiParam({
    name: 'type',
    enum: ['user', 'asset'],
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [GetRecentItemResponse] })
  @ApiResponse({ type: [GetInterestsResponseDto] })
  GetRecentSearchItems(
    @AuthUser() user: DecodedTokenPayload,
    @Param() param: listRecentSearchItemDto,
  ) {
    return this.commonService.listRecentSearchItems(param.type, user.userId);
  }
}
