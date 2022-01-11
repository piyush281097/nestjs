"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbExceptionError = void 0;
const constants_1 = require("../shared/constants");
const common_1 = require("@nestjs/common");
const utils_service_1 = require("../utils/utils.service");
class DbExceptionError extends common_1.HttpException {
    constructor(props, context) {
        if (context.includes('duplicate key value violates unique constraint')) {
            props = {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: [
                    `${utils_service_1.UtilsService.convertSnakeCaseToCamelCase(props.detail.split(/[()]/, 2)[1])} should be unique`,
                ],
            };
            context = 400;
        }
        else if (context.includes('violates foreign key constraint')) {
            props = {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: [
                    `${utils_service_1.UtilsService.convertSnakeCaseToCamelCase(props.detail.split(/[()]/, 2)[1])} is invalid`,
                ],
            };
            context = 400;
        }
        else if (context.includes('violates check constraint')) {
            props = {
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: [
                    `${utils_service_1.UtilsService.convertSnakeCaseToCamelCase(context.split(/"(.*?)"/g, 2)[1])} should be a allowed value`,
                ],
            };
            context = 400;
        }
        else {
            props = {
                statusCode: constants_1.ERROR_CODES.DEFAULT.statusCode,
                message: constants_1.ERROR_CODES.DEFAULT.message,
            };
            context = constants_1.ERROR_CODES.DEFAULT.statusCode;
        }
        super(props, context);
    }
}
exports.DbExceptionError = DbExceptionError;
//# sourceMappingURL=db-exception.error.js.map