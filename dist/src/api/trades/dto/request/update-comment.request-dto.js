"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCommentOnTradeRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const add_comment_db_query_1 = require("./add-comment.db-query");
class UpdateCommentOnTradeRequestDto extends (0, swagger_1.PartialType)(add_comment_db_query_1.AddCommentOnTradeRequestDto) {
}
exports.UpdateCommentOnTradeRequestDto = UpdateCommentOnTradeRequestDto;
//# sourceMappingURL=update-comment.request-dto.js.map