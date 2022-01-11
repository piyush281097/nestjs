import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { ListAllPostsQueryDto } from '../posts/dto/request/list-all-posts.query-dto';
import { BookmarkService } from './bookmark.service';
export declare class BookmarkController {
    private readonly bookmarkService;
    constructor(bookmarkService: BookmarkService);
    create(user: DecodedTokenPayload, postId: number): import("rxjs").Observable<{}>;
    findAllPosts(user: DecodedTokenPayload, query: ListAllPostsQueryDto): import("rxjs").Observable<any[]>;
    remove(user: DecodedTokenPayload, postId: number): import("rxjs").Observable<{}>;
}
