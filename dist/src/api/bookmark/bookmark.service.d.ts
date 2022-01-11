import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { S3Service } from 'src/shared/s3/s3.service';
import { ConfigType } from '@nestjs/config';
import { ListAllPostsQueryDto } from '../posts/dto/request/list-all-posts.query-dto';
export declare class BookmarkService {
    private config;
    private db;
    private S3;
    private logger;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, S3: S3Service, logger: Logger);
    createPostsBookmark(userId: number, postId: number): import("rxjs").Observable<{}>;
    listAllBookmarkedPosts(loggedInUserId: number, queryParams: ListAllPostsQueryDto): import("rxjs").Observable<any[]>;
    DeletePostsBookmark(userId: number, postId: number): import("rxjs").Observable<{}>;
}
