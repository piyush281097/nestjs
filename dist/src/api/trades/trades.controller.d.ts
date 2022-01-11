import { Observable } from 'rxjs';
import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { ListAllPostsQueryDto } from '../posts/dto/request/list-all-posts.query-dto';
import { AddCommentOnTradeRequestDto } from './dto/request/add-comment.db-query';
import { CreateTradeRequestDto } from './dto/request/create-trade.request-dto';
import { ListAllTradesQueryDto } from './dto/request/list-all-trades.query-dto';
import { UpdateCommentOnTradeRequestDto } from './dto/request/update-comment.request-dto';
import { UpdateLikeForCommentOnTradeParam } from './dto/request/update-like-for-comment.param-dto';
import { UpdateLikeForTradeParam } from './dto/request/update-like-for-trade.param-dto';
import { TradesService } from './trades.service';
export declare class TradesController {
    private readonly tradesService;
    constructor(tradesService: TradesService);
    create(user: DecodedTokenPayload, createTradeDto: CreateTradeRequestDto): Observable<any[]>;
    findAllTrades(user: DecodedTokenPayload, query: ListAllTradesQueryDto): Observable<any[]>;
    findTradesOfAUser(user: DecodedTokenPayload, query: ListAllTradesQueryDto, userId?: number): Observable<any[]>;
    UpdateTrade(user: DecodedTokenPayload, createTradeDto: CreateTradeRequestDto, tradeId: number): Observable<any>;
    remove(user: DecodedTokenPayload, tradeId: number): Observable<any>;
    UpdateTradeLike(user: DecodedTokenPayload, param: UpdateLikeForTradeParam): Observable<any[]>;
    GetLikeDetailsOfTrade(user: DecodedTokenPayload, query: ListAllTradesQueryDto, tradeId: number): Observable<any[]>;
    AddCommentOnTrade(user: DecodedTokenPayload, tradeId: number, body: AddCommentOnTradeRequestDto): Observable<any>;
    ListCommentOfATrade(user: DecodedTokenPayload, query: ListAllTradesQueryDto, tradeId: number): Observable<any[]>;
    ListRepliesOfCommentOfATrade(user: DecodedTokenPayload, query: ListAllTradesQueryDto, tradeId: number, commentId: number): Observable<any[]>;
    UpdateCommentOnTrade(user: DecodedTokenPayload, createTradeDto: UpdateCommentOnTradeRequestDto, tradeId: number, commentId: number): Observable<any>;
    RemoveCommentOnTrade(user: DecodedTokenPayload, tradeId: number, commentId: number): Observable<any>;
    UpdateLikeForCommentOnTrade(user: DecodedTokenPayload, param: UpdateLikeForCommentOnTradeParam): Observable<any[]>;
    GetLikesForCommentOnTrade(user: DecodedTokenPayload, query: ListAllTradesQueryDto, tradeId: number, commentId: number): Observable<any[]>;
    ListAllTradesWithTaggedAsset(user: DecodedTokenPayload, query: ListAllPostsQueryDto, value: string): Observable<any[]>;
}
