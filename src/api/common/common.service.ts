import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { UtilsService } from 'src/utils/utils.service';

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { getAllExperienceLevelDbQuery } from './db-query/get-all-experience-level.db-query';
import { getAllInterestsDbQuery } from './db-query/get-all-interests.db-query';
import { getAllInvestmentStylesDbQuery } from './db-query/get-all-investment-style.db-query';
import { AddRecentSearchRequestDto } from './dto/request/add-recent-search-history.request-dto';
import { GetExperienceLevelResponseDto } from './dto/response/get-experience-level.response-dto';
import { GetInterestsResponseDto } from './dto/response/get-interests.response-dto';
import { GetInvestmentStyleResponseDto } from './dto/response/get-investment-styes.response-dto';

@Injectable()
export class CommonService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private logger: Logger,
  ) {
    this.logger.setContext(CommonService.name);
  }

  getAllInterests(): Observable<GetInterestsResponseDto[]> {
    return this.db.rawQuery(
      getAllInterestsDbQuery,
      [],
      GetInterestsResponseDto,
    );
  }

  getAllExperienceLevel(): Observable<GetExperienceLevelResponseDto[]> {
    return this.db.rawQuery(
      getAllExperienceLevelDbQuery,
      [],
      GetExperienceLevelResponseDto,
    );
  }

  getAllInvestStyles(): Observable<GetInvestmentStyleResponseDto[]> {
    return this.db.rawQuery(
      getAllInvestmentStylesDbQuery,
      [],
      GetInvestmentStyleResponseDto,
    );
  }

  getAllHashtags(limit: number, offset: number, query?: string) {
    let dbQuery = `SELECT * from master_hashtags 
    -- TAG_NAME_CONDITION
    ORDER by last_updated DESC LIMIT $1 OFFSET $2`;
    const data: any[] = [limit, offset];

    if (query) {
      dbQuery = dbQuery.replace(
        '-- TAG_NAME_CONDITION',
        'WHERE tag_name ILIKE $3',
      );
      data.push(`${query}%`);
    }
    return this.db.rawQuery(dbQuery, data, null);
  }

  addRecentSearchUser(createdUserId: number, body: AddRecentSearchRequestDto) {
    const { assetId, userId } = body;

    const valuesArray = [],
      queriesArray = [];

    if (!(assetId || userId)) {
      throw new BadRequestException('assetId or userId is required');
    }

    if (assetId) {
      valuesArray.push(createdUserId);

      const { data: createAssetMasterData, query: createAssetMasterQuery } =
        UtilsService.buildInsertQuery({
          tableName: 'master_assets',
          columnData: [assetId].map((x) => ({
            symbol: x,
          })),
          keysToIgnore: [],
          keysToReplace: [],
          start: valuesArray.length + 1,
        });

      queriesArray.push(`
      ins_master_asset AS (
        ${createAssetMasterQuery}
            ON CONFLICT("symbol")
              DO NOTHING
                RETURNING id
            ),    
        select_asset_ids as (
          SELECT * FROM ins_master_asset
              UNION
          SELECT id FROM master_assets
                where 
            symbol in ( ${createAssetMasterData
              .map((x, i) => `$${valuesArray.length + i + 1}`)
              .join(', ')} )
        ),          
        ins_asset_recent_search as (
          INSERT INTO recent_search (created_by, asset_id) 
          SELECT
              $1, id
          FROM
              select_asset_ids
          RETURNING *
        )
      `);
      valuesArray.push(...createAssetMasterData);
    } else {
      const { data, query } = UtilsService.buildInsertQuery({
        tableName: 'recent_search',
        columnData: [
          {
            userId,
            createdBy: createdUserId,
          },
        ],
        keysToIgnore: ['assetId'],
        keysToReplace: {},
        start: valuesArray.length + 1,
      });
      queriesArray.push(`ins_user_recent_search as ( ${query} )`);
      valuesArray.push(...data);
    }

    return this.db.rawQuery(
      `WITH ${queriesArray.join(', ')} (select 1 as success) `,
      valuesArray,
      null,
    );
  }

  listRecentSearchItems(type: string, userId: number) {
    let dbQuery = '';
    const data = [userId];

    if (type === 'asset') {
      dbQuery = `select recent_search.id, symbol
      from recent_search
               LEFT OUTER JOIN master_assets ma on ma.id = recent_search.asset_id
      WHERE user_id is null
        AND created_by = $1
      ORDER BY recent_search.last_updated desc
      LIMIT 5;`;
    } else {
      dbQuery = `SELECT user_handle,
      first_name,
      last_name,
            up.user_id
      FROM recent_search
              LEFT JOIN user_core uc on recent_search.user_id = uc.id
              LEFT JOIN user_profile up ON up.user_id = uc.id
      WHERE asset_id is null AND created_by = $1
      ORDER BY recent_search.last_updated desc
      LIMIT 5;
      `;
    }

    return this.db.rawQuery(dbQuery, data, null);
  }
}
