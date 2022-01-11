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
var RoomService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomService = void 0;
const configuration_1 = require("../../config/configuration");
const database_service_1 = require("../../database/database.service");
const logging_service_1 = require("../../shared/logger/logging.service");
const utils_service_1 = require("../../utils/utils.service");
const rxjs_1 = require("rxjs");
const common_1 = require("@nestjs/common");
let RoomService = RoomService_1 = class RoomService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(RoomService_1.name);
    }
    CreatemessageRoom(senderid, receiverid, message) {
        return this.db.rawQuery(`INSERT INTO message (senderid, receiverid, message)
        VALUES ($1, $2, $3)`, [senderid, receiverid, message], null);
    }
    GetUser() {
        return this.db.rawQuery('select * from users', [], null);
    }
    GetSearchUser(text) {
        var result = this.db.rawQuery('select * from users', [], null);
        const source = (0, rxjs_1.from)(result);
        const example = source.pipe((0, rxjs_1.filter)(str => str.name.toLowerCase().includes(text.toLowerCase())));
    }
};
RoomService = RoomService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [void 0, database_service_1.DatabaseService,
        logging_service_1.Logger])
], RoomService);
exports.RoomService = RoomService;
//# sourceMappingURL=room.service.js.map