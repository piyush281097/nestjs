import { map } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { S3Service } from 'src/shared/s3/s3.service';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { listAllPostsDbQuery } from '../posts/db-query/list-all-post.db-query';
import { ListAllPostsQueryDto } from '../posts/dto/request/list-all-posts.query-dto';
import { ListAllPostsResponseDto } from '../posts/dto/response/list-all-post.response-dto';

@Injectable()
export class BookmarkService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private S3: S3Service,
    private logger: Logger,
  ) {
    this.logger.setContext(BookmarkService.name);
  }

  createPostsBookmark(userId: number, postId: number) {
    const dbQuery = `
    INSERT INTO saved_items (user_id, post_id, type)
    VALUES ($1, $2, 'post')`;

    return this.db
      .rawQuery(dbQuery, [userId, postId], null)
      .pipe(map(() => ({})));
  }

  listAllBookmarkedPosts(
    loggedInUserId: number,
    queryParams: ListAllPostsQueryDto,
  ) {
    let dbQuery = listAllPostsDbQuery;

    const { limit, offset } = queryParams;
    const data = [limit, offset, loggedInUserId];

    dbQuery = dbQuery.replace(
      '--INNER_JOIN_SAVED_ITEMS',
      'INNER JOIN saved_items si ON si.user_id = $3 AND si.post_id = pm.id',
    );

    dbQuery = dbQuery.replace(
      'ORDER BY pm.last_updated DESC',
      'ORDER BY si.last_updated DESC',
    );
    dbQuery = dbQuery.replace('--GROUP_BY_SAVED', ', si.last_updated');

    return this.db.rawQuery(dbQuery, data, ListAllPostsResponseDto);
  }

  DeletePostsBookmark(userId: number, postId: number) {
    const dbQuery = `
    DELETE FROM saved_items 
    WHERE user_id = $1 AND post_id = $2 AND type = 'post';`;

    return this.db
      .rawQuery(dbQuery, [userId, postId], null)
      .pipe(map(() => ({})));
  }
}
