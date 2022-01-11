import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AssetsService } from './assets.service';
import {
  AssetDetailsDto,
  AssetFundamentalsDto,
  AssetLogoResponseDto,
} from './dto/response/asset-logo.response-dto';
import { AssetSearchResponseDto } from './dto/response/asset-search.response-dto';
import { AssetListResponseDto } from './dto/response/assets-list.response-dto';

@Controller({
  path: 'assets',
  version: '1',
})
@ApiTags('Assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get('search')
  @ApiBearerAuth()
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Name or Asset symbol to search',
  })
  @ApiResponse({ type: [AssetSearchResponseDto] })
  AssetSearch(@Query('query') query: string) {
    return this.assetsService.getAssetDetails(query);
  }

  @Get('logo/:symbol')
  @ApiBearerAuth()
  @ApiParam({
    name: 'symbol',
    required: true,
    description: 'Asset symbol to search',
  })
  @ApiResponse({ type: AssetLogoResponseDto })
  GetAssetLogo(@Param('symbol') symbol: string) {
    return this.assetsService.getAssetLogo(symbol);
  }

  // @Get('search-list')
  // @ApiOperation({
  //   summary: 'Use this API to list assets for mentioning',
  // })
  // @ApiBearerAuth()
  // @ApiQuery({
  //   name: 'query',
  //   description: 'Search by Asset name or symbol',
  // })
  // @ApiResponse({ type: [AssetListResponseDto] })
  // SearchAssetDB(@Query('query') query: string) {
  //   return this.assetsService.searchAssetsFromDb(query);
  // }

  @Get('details/:symbol')
  @ApiBearerAuth()
  @ApiParam({
    name: 'symbol',
    required: true,
    description: 'Asset symbol to search',
  })
  @ApiResponse({ type: AssetDetailsDto })
  GetCompanyDetails(@Param('symbol') symbol: string) {
    return this.assetsService.getCompanyInfo(symbol);
  }

  @Get('fundamental/:symbol')
  @ApiBearerAuth()
  @ApiParam({
    name: 'symbol',
    required: true,
    description: 'Asset symbol to search',
  })
  @ApiResponse({ type: AssetFundamentalsDto })
  GetCompanyFundamentals(@Param('symbol') symbol: string) {
    return this.assetsService.getCompanyFundamentals(symbol);
  }

  @Get('news/:symbol')
  @ApiBearerAuth()
  @ApiParam({
    name: 'symbol',
    required: true,
    description: 'Asset symbol to search',
  })
  @ApiResponse({ type: AssetLogoResponseDto })
  GetCompanyNews(@Param('symbol') symbol: string) {
    return this.assetsService.getCompanyNews(symbol);
  }
}
