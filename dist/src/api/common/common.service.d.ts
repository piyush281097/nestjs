import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { ConfigType } from '@nestjs/config';
import { AddRecentSearchRequestDto } from './dto/request/add-recent-search-history.request-dto';
import { GetExperienceLevelResponseDto } from './dto/response/get-experience-level.response-dto';
import { GetInterestsResponseDto } from './dto/response/get-interests.response-dto';
import { GetInvestmentStyleResponseDto } from './dto/response/get-investment-styes.response-dto';
export declare class CommonService {
    private config;
    private db;
    private logger;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, logger: Logger);
    getAllInterests(): Observable<GetInterestsResponseDto[]>;
    getAllExperienceLevel(): Observable<GetExperienceLevelResponseDto[]>;
    getAllInvestStyles(): Observable<GetInvestmentStyleResponseDto[]>;
    getAllHashtags(limit: number, offset: number, query?: string): Observable<any[]>;
    addRecentSearchUser(createdUserId: number, body: AddRecentSearchRequestDto): Observable<any[]>;
    listRecentSearchItems(type: string, userId: number): Observable<any[]>;
}
