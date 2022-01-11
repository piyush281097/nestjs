"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 183:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var RoomService_1, _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoomService = void 0;
const rxjs_1 = __webpack_require__(16);
const configuration_1 = __webpack_require__(10);
const database_service_1 = __webpack_require__(19);
const logging_service_1 = __webpack_require__(26);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(5);
let RoomService = RoomService_1 = class RoomService {
    constructor(config, db, logger) {
        this.config = config;
        this.db = db;
        this.logger = logger;
        this.logger.setContext(RoomService_1.name);
    }
    CreatemessageRoom() {
        return this.db.rawQuery("SELECT * FROM singlerooms", [], null).pipe((0, rxjs_1.map)((x) => { var _a; return (_a = x[0]) !== null && _a !== void 0 ? _a : {}; }));
    }
};
RoomService = RoomService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(configuration_1.default.KEY)),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigType !== "undefined" && config_1.ConfigType) === "function" ? _a : Object, typeof (_b = typeof database_service_1.DatabaseService !== "undefined" && database_service_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof logging_service_1.Logger !== "undefined" && logging_service_1.Logger) === "function" ? _c : Object])
], RoomService);
exports.RoomService = RoomService;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("2e75dee1c1a723b9fbf6")
/******/ })();
/******/ 
/******/ }
;