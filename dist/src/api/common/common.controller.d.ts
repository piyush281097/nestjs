import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { CommonService } from './common.service';
import { AddRecentSearchRequestDto, listRecentSearchItemDto } from './dto/request/add-recent-search-history.request-dto';
import { ListAllHashtagsQueryDto } from './dto/request/list-hashtags.request-dto';
import { GetInterestsResponseDto } from './dto/response/get-interests.response-dto';
export declare class CommonController {
    private readonly commonService;
    constructor(commonService: CommonService);
    GetAllInterests(): import("rxjs").Observable<GetInterestsResponseDto[]>;
    GetAllExperienceLevel(): import("rxjs").Observable<import("./dto/response/get-experience-level.response-dto").GetExperienceLevelResponseDto[]>;
    GetAllInvestmentStyles(): import("rxjs").Observable<import("./dto/response/get-investment-styes.response-dto").GetInvestmentStyleResponseDto[]>;
    GetAllHashtags(queryVal: ListAllHashtagsQueryDto): import("rxjs").Observable<any[]>;
    AddRecentSearchUser(user: DecodedTokenPayload, body: AddRecentSearchRequestDto): import("rxjs").Observable<any[]>;
    GetRecentSearchItems(user: DecodedTokenPayload, param: listRecentSearchItemDto): import("rxjs").Observable<any[]>;
}
