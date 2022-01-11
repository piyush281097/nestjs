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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const user_token_payload_decorator_1 = require("../../utils/decorator/user-token-payload.decorator");
const common_1 = require("@nestjs/common");
const room_service_1 = require("./room.service");
let RoomController = class RoomController {
    constructor(myService) {
        this.myService = myService;
    }
    CreateRoom(senderid, receiverid, message) {
        return this.myService.CreatemessageRoom(senderid, receiverid, message);
    }
    Getuser() {
        return this.myService.GetUser();
    }
    Getusers(text) {
        return this.myService.GetSearchUser(text);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('senderid')),
    __param(1, (0, common_1.Body)('receiverid')),
    __param(2, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "CreateRoom", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "Getuser", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "Getusers", null);
RoomController = __decorate([
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map