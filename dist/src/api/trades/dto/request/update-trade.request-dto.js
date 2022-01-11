"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTradeRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_trade_request_dto_1 = require("./create-trade.request-dto");
class UpdateTradeRequestDto extends (0, swagger_1.PartialType)(create_trade_request_dto_1.CreateTradeRequestDto) {
}
exports.UpdateTradeRequestDto = UpdateTradeRequestDto;
//# sourceMappingURL=update-trade.request-dto.js.map