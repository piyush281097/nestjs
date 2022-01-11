"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentOnPostRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const add_comment_db_query_1 = require("./add-comment.db-query");
class UpdateCommentOnPostRequestDto extends (0, swagger_1.PartialType)(add_comment_db_query_1.AddCommentOnPostRequestDto) {
}
exports.UpdateCommentOnPostRequestDto = UpdateCommentOnPostRequestDto;
//# sourceMappingURL=update-comment.request-dto.js.map