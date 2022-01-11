"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BookmarkService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const logging_service_1 = require("../../shared/logger/logging.service");
const s3_service_1 = require("../../shared/s3/s3.service");
const common_1 = require("@nestjs/common");
const list_all_post_db_query_1 = require("../posts/db-query/list-all-post.db-query");
const list_all_post_response_dto_1 = require("../posts/dto/response/list-all-post.response-dto");
let BookmarkService = BookmarkService_1 = class BookmarkService {
    constructor(config, db, S3, logger) {
        this.config = config;
        this.db = db;
        this.S3 = S3;
        this.logger = logger;
        this.logger.setContext(BookmarkService_1.name);
    }
    createPostsBookmark(userId, postId) {
        const dbQuery = `
    INSERT INTO saved_items (user_id, post_id, type)
    VALUES ($1, $2, 'post')`;
        return this.db
            .rawQuery(dbQuery, [userId, postId], null)
            .pipe((0, rxjs_1.map)(() => ({})));
    }
    listAllBookmarkedPosts(loggedInUserId, queryParams) {
        let dbQuery = list_all_post_db_query_1.listAllPostsDbQuery;
        const { limit, offset } = queryParams;
        const data = [limit, offset, loggedInUserId];
        dbQuery = dbQuery.replace('--INNER_JOIN_SAVED_ITEMS', 'INNER JOIN saved_items si ON si.user_id = $3 AND si.post_id = pm.id');
        dbQuery = dbQuery.replace('ORDER BY pm.last_updated DESC', 'ORDER BY si.last_updated DESC');
        dbQuery = dbQuery.replace('--GROUP_BY_SAVED', ', si.last_updated');
        return this.db.rawQuery(dbQuery, data, list_all_post_response_dto_1.ListAllPostsResponseDto);
    }
    DeletePostsBookmark(userId, postId) {
        const dbQuery = `
    DELETE FROM saved_items 
    WHERE user_id = $1 AND post_id = $2 AND type = 'post';`;
        return this.db
            .rawQuery(dbQuery, [userId, postId], null)
            .pipe((0, rxjs_1.map)(() => ({})));
    }
};
BookmarkService = BookmarkService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        s3_service_1.S3Service,
        logging_service_1.Logger])
], BookmarkService);
exports.BookmarkService = BookmarkService;
//# sourceMappingURL=bookmark.service.js.map