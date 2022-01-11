"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserByEmailWithPassword = exports.GetUserByEmailDbDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GetUserByEmailDbDto {
}
exports.GetUserByEmailDbDto = GetUserByEmailDbDto;
class GetUserByEmailWithPassword extends (0, swagger_1.OmitType)(GetUserByEmailDbDto, [
    'password',
    'passwordSalt',
]) {
}
exports.GetUserByEmailWithPassword = GetUserByEmailWithPassword;
//# sourceMappingURL=get-user-by-email.db-dto.js.map