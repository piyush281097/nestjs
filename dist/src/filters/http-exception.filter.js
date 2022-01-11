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
var HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const constants_1 = require("../shared/constants");
const common_1 = require("@nestjs/common");
const logging_service_1 = require("../shared/logger/logging.service");
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    constructor(logger) {
        this.logger = logger;
        this.logger.setContext(HttpExceptionFilter_1.name);
    }
    catch(exception, host) {
        var _a, _b, _c, _d;
        console.log(exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let resError;
        let msg;
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.FORBIDDEN;
        if ((_a = exception.response) === null || _a === void 0 ? void 0 : _a.statusCode) {
            msg = exception.response.message;
            resError = exception.response;
        }
        else if ((_b = exception.response) === null || _b === void 0 ? void 0 : _b.code) {
            msg = exception.response.message;
            resError = exception.response;
        }
        else if ((_d = (_c = exception.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.statusCode) {
            msg = exception.response.data.message;
            resError = exception.response.data;
        }
        else {
            msg =
                typeof exception.message === 'string'
                    ? exception.message
                    : exception.message.message;
            resError = constants_1.ERROR_CODES.DEFAULT;
        }
        const logError = {
            statusCode: status,
            timestamp: new Date().toString(),
            path: request.url,
            message: msg || 'Something went wrong',
            host: request.headers.host,
            response: resError,
        };
        this.logger.log(`${request.method} ${request.url} ${status}
      ${JSON.stringify(logError)}`);
        return response.status(status).send(resError);
    }
};
HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logging_service_1.Logger])
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;
//# sourceMappingURL=http-exception.filter.js.map