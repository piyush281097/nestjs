import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { S3Service } from 'src/shared/s3/s3.service';
import { ConfigType } from '@nestjs/config';
import { AddCommentOnPostRequestDto } from './dto/request/add-comment.db-query';
import { CreatePostRequestDto } from './dto/request/create-post.request-dto';
import { ListAllPostsQueryDto } from './dto/request/list-all-posts.query-dto';
import { UpdateCommentOnPostRequestDto } from './dto/request/update-comment.request-dto';
import { UpdatePostRequestDto } from './dto/request/update-post.request-dto';
export declare class PostsService {
    private config;
    private db;
    private S3;
    private logger;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, S3: S3Service, logger: Logger);
    create(userId: number, post: CreatePostRequestDto): import("rxjs").Observable<any>;
    findAll(loggedInUserId: number, userId: number, queryParams: ListAllPostsQueryDto): import("rxjs").Observable<any[]>;
    updatePost(userId: number, postId: number, updatePost: UpdatePostRequestDto): import("rxjs").Observable<any>;
    deletePost(userId: number, postId: number): import("rxjs").Observable<any>;
    getPreSignedUrlForAttachment(fileName: string, userId: number): import("rxjs").Observable<{
        filePath: string;
        uploadUrl: string;
    }>;
    UpdateAttachmentUrls(filePath: string, userId: number): import("rxjs").Observable<any>;
    updateLikeForPost(userId: number, postId: number, isDeleted: string): import("rxjs").Observable<any[]>;
    getPostLikeUsers(postId: number, queryParams: ListAllPostsQueryDto): import("rxjs").Observable<any[]>;
    addCommentOnPost(userId: number, postId: number, postComment: AddCommentOnPostRequestDto): import("rxjs").Observable<any>;
    listCommentOfPost(postId: number, userId: number, query: ListAllPostsQueryDto, commentId?: number, getReplies?: boolean): import("rxjs").Observable<any[]>;
    updateCommentOnPost(userId: number, commentId: number, postId: number, updatePostComment: UpdateCommentOnPostRequestDto): import("rxjs").Observable<any>;
    deleteCommentOnPost(userId: number, postId: number, commentId: number): import("rxjs").Observable<any>;
    updateLikeForCommentOnPost(userId: number, postId: number, commentId: number, isDeleted: string): import("rxjs").Observable<any[]>;
    getLikeForCommentOnPost(commentId: number, queryParams: ListAllPostsQueryDto): import("rxjs").Observable<any[]>;
    getPostsWhichTagged(queryParams: ListAllPostsQueryDto, type: string, value: string, userId: number): import("rxjs").Observable<any[]>;
}
