import { map } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { UtilsService } from 'src/utils/utils.service';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { GetAllFollowersListDbQuery } from './db-query/get-all-follower-list.db-query';
import { ListAllFollowersQueryDto } from './dto/request/list-all-followers.query-dto';

@Injectable()
export class FollowersService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private logger: Logger,
  ) {
    this.logger.setContext(FollowersService.name);
  }

  getAllFollowers(userId: number, queryParams: ListAllFollowersQueryDto) {
    const { limit, offset } = queryParams;
    const data = [limit, offset, userId];

    return this.db
      .rawQuery(GetAllFollowersListDbQuery, data, null)
      .pipe(map((x) => x[0] ?? {}));
  }

  followUser(userId: number, userToFollow: number, followType: string) {
    const isDeleted = followType !== 'follow';
    const data = [userId, userToFollow, isDeleted];
    let dbQuery = `INSERT INTO followers (user_id, follower_id, is_deleted)
          VALUES ($1, $2, $3)
      ON CONFLICT (user_id, follower_id)
          DO UPDATE SET
              is_deleted = EXCLUDED.is_deleted,
              last_updated = CURRENT_TIMESTAMP;`;

    if (isDeleted) {
      dbQuery = `DELETE FROM followers where user_id = $1 AND follower_id = $2`;
      data.pop();
    }

    return this.db.rawQuery(dbQuery, data, null).pipe(map((x) => x[0] ?? {}));
  }

  followListOfUsers(
    userId: number,
    usersToFollow: number[],
    followType: string,
  ) {
    const isDeleted = followType !== 'follow';
    const valuesArray = [userId];

    const { query, data } = UtilsService.buildInsertQuery({
      tableName: 'followers',
      columnData: usersToFollow.map((x) => ({
        followerId: x,
        isDeleted,
      })),
      keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
      addSqlQuery: {
        user_id: '$1',
      },
      start: valuesArray.length + 1,
    });

    valuesArray.push(...data);
    console.log({ valuesArray });

    const dbQuery = `${query}
      ON CONFLICT (user_id, follower_id)
          DO UPDATE SET
              is_deleted = EXCLUDED.is_deleted,
              last_updated = CURRENT_TIMESTAMP;`;

    return this.db
      .rawQuery(dbQuery, valuesArray, null)
      .pipe(map((x) => x[0] ?? {}));
  }

  RemoveAFollowingUser(userId: number, userToUnFollow: number) {
    const dbQuery = `DELETE FROM followers where follower_id = $1 AND  user_id = $2`;
    return this.db
      .rawQuery(dbQuery, [userId, userToUnFollow], null)
      .pipe(map((x) => x[0] ?? {}));
  }
}
