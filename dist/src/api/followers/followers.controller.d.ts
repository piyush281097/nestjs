import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { FollowArrayOfUsersDto } from './dto/request/follow-array-of-users.request-dto';
import { ListAllFollowersQueryDto } from './dto/request/list-all-followers.query-dto';
import { FollowersService } from './followers.service';
export declare class FollowersController {
    private readonly followersService;
    constructor(followersService: FollowersService);
    findAll(user: DecodedTokenPayload, query: ListAllFollowersQueryDto): import("rxjs").Observable<any>;
    ListAllFollowersOfNonLoggedInUser(user: DecodedTokenPayload, userId: number, query: ListAllFollowersQueryDto): import("rxjs").Observable<any>;
    FollowListOfUsers(user: DecodedTokenPayload, body: FollowArrayOfUsersDto, followType: string): import("rxjs").Observable<any>;
    FollowUser(user: DecodedTokenPayload, userId: number, followType: string): import("rxjs").Observable<any>;
    RemoveAUserFollowing(user: DecodedTokenPayload, userId: number): import("rxjs").Observable<any>;
}
