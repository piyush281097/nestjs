"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.default = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'staging', 'production')
        .default('development'),
    LOGGER_LEVEL: Joi.string()
        .valid('error', 'warn', 'log', 'debug')
        .default('log'),
    PORT: Joi.number().default(3000),
    DB_PORT: Joi.number().default(5432),
});
//# sourceMappingURL=validation.js.map