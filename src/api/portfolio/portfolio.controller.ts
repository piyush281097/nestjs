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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import {
  AddPortfolioName,
  AddPortfolioWithAsset,
  GetAllPortFolioResponse,
  listAllPortfolioGroups,
  UpdatePortfolioWithAsset,
} from './dto/create-portfolio.dto';
import { PortfolioService } from './portfolio.service';

@ApiTags('Portfolio')
@ApiBearerAuth()
@Controller({
  path: 'portfolio',
  version: '1',
})
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('group')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a portfolio group',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: AddPortfolioName })
  @ApiResponse({})
  create(
    @AuthUser() user: DecodedTokenPayload,
    @Body() createPostDto: AddPortfolioName,
  ) {
    return this.portfolioService.create(user.userId, createPostDto.name);
  }

  @Get('group')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a portfolio group',
  })
  @UsePipes(new ValidationPipe())
  @ApiQuery({
    name: 'query',
    description: 'Query variable to search portfolio group',
  })
  @ApiResponse({ type: [listAllPortfolioGroups] })
  findAll(
    @AuthUser() user: DecodedTokenPayload,
    @Query('query') query: string,
  ) {
    return this.portfolioService.findAll(user.userId, query);
  }

  @Patch('group/:groupId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update a portfolio group name',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({})
  update(
    @AuthUser() user: DecodedTokenPayload,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() body: AddPortfolioName,
  ) {
    return this.portfolioService.update(user.userId, groupId, body.name);
  }

  @Delete('group/:groupId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a portfolio group',
  })
  @ApiResponse({})
  remove(
    @AuthUser() user: DecodedTokenPayload,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.portfolioService.remove(user.userId, groupId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a portfolio',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: AddPortfolioWithAsset })
  @ApiResponse({})
  createPortfolio(
    @AuthUser() user: DecodedTokenPayload,
    @Body() portfolio: AddPortfolioWithAsset,
  ) {
    return this.portfolioService.addPortfolio(user.userId, portfolio);
  }

  @Get(':portfolioGroupId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'List all assets under a portfolio group',
  })
  @UsePipes(new ValidationPipe())
  @ApiResponse({ type: [GetAllPortFolioResponse] })
  listPortfolioByGroup(
    @AuthUser() user: DecodedTokenPayload,
    @Param('portfolioGroupId') portfolioGroupId: number,
  ) {
    return this.portfolioService.findAllPortfolioOfaGroup(
      user.userId,
      portfolioGroupId,
    );
  }

  @Patch(':portfolioId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update a portfolio item',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: UpdatePortfolioWithAsset })
  @ApiResponse({})
  PatchPortfolioItem(
    @AuthUser() user: DecodedTokenPayload,
    @Param('portfolioId', ParseIntPipe) portfolioId: number,
    @Body() body: UpdatePortfolioWithAsset,
  ) {
    return this.portfolioService.updatePortfolio(
      user.userId,
      portfolioId,
      body,
    );
  }

  @Delete(':portfolioId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete a portfolio group',
  })
  @ApiResponse({})
  DeletePortfolioItem(
    @AuthUser() user: DecodedTokenPayload,
    @Param('groupId', ParseIntPipe) groupId: number,
  ) {
    return this.portfolioService.remove(user.userId, groupId);
  }
}
