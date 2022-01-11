import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { ConfigType } from '@nestjs/config';
import { ListAllFollowersQueryDto } from './dto/request/list-all-followers.query-dto';
export declare class FollowersService {
    private config;
    private db;
    private logger;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, logger: Logger);
    getAllFollowers(userId: number, queryParams: ListAllFollowersQueryDto): import("rxjs").Observable<any>;
    followUser(userId: number, userToFollow: number, followType: string): import("rxjs").Observable<any>;
    followListOfUsers(userId: number, usersToFollow: number[], followType: string): import("rxjs").Observable<any>;
    RemoveAFollowingUser(userId: number, userToUnFollow: number): import("rxjs").Observable<any>;
}
