import { map } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { UtilsService } from 'src/utils/utils.service';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { PostsService } from '../posts/posts.service';
import {
  AddPortfolioWithAsset,
  UpdatePortfolioWithAsset,
} from './dto/create-portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private logger: Logger,
  ) {
    this.logger.setContext(PostsService.name);
  }

  create(userId: number, name: string) {
    const columnToSkip = ['createdAt', 'lastUpdated', 'id', 'isDeleted'];

    const { query, data } = UtilsService.buildInsertQuery({
      tableName: 'portfolio_groups',
      columnData: [
        {
          name,
        },
      ],
      keysToIgnore: [...columnToSkip],
      keysToReplace: {
        userId,
        isDeleted: false,
      },
      start: 1,
    });

    return this.db.rawQuery(query, data, null);
  }

  findAll(userId: number, query?: string) {
    let dbQuery = `SELECT * from portfolio_groups WHERE user_id = $1 AND is_deleted IS NOT TRUE
    -- QUERY_LIKE  
    ORDER BY name`;

    const data: any[] = [userId];

    if (query) {
      dbQuery = dbQuery.replace('-- QUERY_LIKE', 'AND name ILIKE $2');
      data.push(`${query}%`);
    }
    return this.db.rawQuery(dbQuery, data, null);
  }

  update(userId: number, id: number, name: string) {
    const columnToSkip = ['createdAt', 'lastUpdated', 'id', 'isDeleted'];

    const { query, data } = UtilsService.buildUpdateQuery({
      tableName: 'portfolio_groups',
      columnData: { name },
      keysToIgnore: [...columnToSkip],
      keysToReplace: { isDeleted: false },
      whereCondition: 'user_id = $1 and id = $2',
      start: 3,
    });

    return this.db.rawQuery(query, [userId, id, ...data], null);
  }

  remove(userId: number, id: number) {
    return this.db
      .rawQuery(
        `UPDATE
        portfolio_groups
        SET
            is_deleted = TRUE
        WHERE
            user_id = $1 AND id = $2
        RETURNING
        1 AS deleted`,
        [userId, id],
        null,
      )
      .pipe(map((x) => x[0] || {}));
  }

  addPortfolio(userId: number, portfolio: AddPortfolioWithAsset) {
    const columnToSkip = [
      'createdAt',
      'lastUpdated',
      'id',
      'isDeleted',
      'assetId',
    ];
    const valuesArray = [];

    const queriesArray = [];

    const { query, data } = UtilsService.buildInsertQuery({
      tableName: 'portfolio_assets',
      columnData: [portfolio],
      keysToIgnore: [...columnToSkip],
      keysToReplace: {
        isDeleted: false,
      },
      addSqlQuery: {
        asset_id: '(SELECT id from select_asset_ids)',
      },
      start: 1,
    });
    valuesArray.push(...data);

    const { data: createAssetMasterData, query: createAssetMasterQuery } =
      UtilsService.buildInsertQuery({
        tableName: 'master_assets',
        columnData: [{ symbol: portfolio.assetId }],
        keysToIgnore: [],
        keysToReplace: [],
        start: valuesArray.length + 1,
      });

    queriesArray.push(`
    upd_master_asset AS (
      ${createAssetMasterQuery}
          ON CONFLICT("symbol")
            DO NOTHING
              RETURNING id
          ),    
      select_asset_ids as (
        SELECT * FROM upd_master_asset
            UNION
        SELECT id FROM master_assets
              where 
          symbol in ( ${createAssetMasterData
            .map((x, i) => `$${valuesArray.length + i + 1}`)
            .join(', ')} )
      )
    `);
    valuesArray.push(...createAssetMasterData);

    queriesArray.push(
      `ins_portfolio as (
        ${query}
        RETURNING *
      )`,
    );

    return this.db.rawQuery(
      `WITH ${queriesArray.join(', ')} (select id from ins_portfolio) `,
      valuesArray,
      null,
    );
  }

  findAllPortfolioOfaGroup(userId: number, portfolioGroupId: number) {
    const dbQuery = `
    select pa.id, ma.symbol as asset_id, pa.allocation, pa.price, pa.quantity, pa.last_updated
    from portfolio_assets pa
    LEFT JOIN master_assets ma on ma.id = pa.asset_id
    LEFT JOIN portfolio_groups pg on pa.portfolio_group_id = pg.id
    WHERE pg.user_id = $1 AND pa.portfolio_group_id = $2 AND pa.is_deleted IS NOT TRUE
    `;

    return this.db.rawQuery(dbQuery, [userId, portfolioGroupId], null);
  }

  updatePortfolio(
    userId: number,
    portfolioId: number,
    portfolio: UpdatePortfolioWithAsset,
  ) {
    const valuesArray = [portfolioId];

    const queriesArray = [];

    const columnToSkip = [
      'createdAt',
      'lastUpdated',
      'id',
      'isDeleted',
      'assetId',
    ];

    const { query, data } = UtilsService.buildUpdateQuery({
      tableName: 'portfolio_assets',
      columnData: portfolio,
      keysToIgnore: [...columnToSkip],
      keysToReplace: {
        isDeleted: false,
      },
      addSqlQuery: {
        asset_id: '(SELECT id from select_asset_ids)',
      },
      whereCondition: 'id = $1',
      start: 2,
    });
    valuesArray.push(...data);

    const { data: createAssetMasterData, query: createAssetMasterQuery } =
      UtilsService.buildInsertQuery({
        tableName: 'master_assets',
        columnData: [{ symbol: portfolio.assetId }],
        keysToIgnore: [],
        keysToReplace: [],
        start: valuesArray.length + 1,
      });

    queriesArray.push(`
    upd_master_asset AS (
      ${createAssetMasterQuery}
          ON CONFLICT("symbol")
            DO NOTHING
              RETURNING id
          ),    
      select_asset_ids as (
        SELECT * FROM upd_master_asset
            UNION
        SELECT id FROM master_assets
              where 
          symbol in ( ${createAssetMasterData
            .map((x, i) => `$${valuesArray.length + i + 1}`)
            .join(', ')} )
      )
    `);
    valuesArray.push(...createAssetMasterData);

    queriesArray.push(
      `ins_portfolio as (
        ${query}
        RETURNING *
      )`,
    );

    return this.db.rawQuery(
      `WITH ${queriesArray.join(', ')} (select id from ins_portfolio) `,
      valuesArray,
      null,
    );
  }

  removePortfolio(userId: number, id: number) {
    return this.db
      .rawQuery(
        `UPDATE
        portfolio_assets
        SET
            is_deleted = TRUE
        WHERE
            id = $2
        RETURNING
        1 AS deleted`,
        [userId, id],
        null,
      )
      .pipe(map((x) => x[0] || {}));
  }
}
