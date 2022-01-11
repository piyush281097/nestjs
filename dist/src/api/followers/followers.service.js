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
var FollowersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowersService = void 0;
const rxjs_1 = require("rxjs");
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const logging_service_1 = require("../../shared/logger/logging.service");
const utils_service_1 = require("../../utils/utils.service");
const common_1 = require("@nestjs/common");
const get_all_follower_list_db_query_1 = require("./db-query/get-all-follower-list.db-query");
let FollowersService = FollowersService_1 = class FollowersService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(FollowersService_1.name);
    }
    getAllFollowers(userId, queryParams) {
        const { limit, offset } = queryParams;
        const data = [limit, offset, userId];
        return this.db
            .rawQuery(get_all_follower_list_db_query_1.GetAllFollowersListDbQuery, data, null)
            .pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    followUser(userId, userToFollow, followType) {
        const isDeleted = followType !== 'follow';
        const data = [userId, userToFollow, isDeleted];
        let dbQuery = `INSERT INTO followers (user_id, follower_id, is_deleted)
          VALUES ($1, $2, $3)
      ON CONFLICT (user_id, follower_id)
          DO UPDATE SET
              is_deleted = EXCLUDED.is_deleted,
              last_updated = CURRENT_TIMESTAMP;`;
        if (isDeleted) {
            dbQuery = `DELETE FROM followers where user_id = $1 AND follower_id = $2`;
            data.pop();
        }
        return this.db.rawQuery(dbQuery, data, null).pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    followListOfUsers(userId, usersToFollow, followType) {
        const isDeleted = followType !== 'follow';
        const valuesArray = [userId];
        const { query, data } = utils_service_1.UtilsService.buildInsertQuery({
            tableName: 'followers',
            columnData: usersToFollow.map((x) => ({
                followerId: x,
                isDeleted,
            })),
            keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
            addSqlQuery: {
                user_id: '$1',
            },
            start: valuesArray.length + 1,
        });
        valuesArray.push(...data);
        console.log({ valuesArray });
        const dbQuery = `${query}
      ON CONFLICT (user_id, follower_id)
          DO UPDATE SET
              is_deleted = EXCLUDED.is_deleted,
              last_updated = CURRENT_TIMESTAMP;`;
        return this.db
            .rawQuery(dbQuery, valuesArray, null)
            .pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
    RemoveAFollowingUser(userId, userToUnFollow) {
        const dbQuery = `DELETE FROM followers where follower_id = $1 AND  user_id = $2`;
        return this.db
            .rawQuery(dbQuery, [userId, userToUnFollow], null)
            .pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
};
FollowersService = FollowersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        logging_service_1.Logger])
], FollowersService);
exports.FollowersService = FollowersService;
//# sourceMappingURL=followers.service.js.map