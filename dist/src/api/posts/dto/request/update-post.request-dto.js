"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_post_request_dto_1 = require("./create-post.request-dto");
class UpdatePostRequestDto extends (0, swagger_1.PartialType)(create_post_request_dto_1.CreatePostRequestDto) {
}
exports.UpdatePostRequestDto = UpdatePostRequestDto;
//# sourceMappingURL=update-post.request-dto.js.map