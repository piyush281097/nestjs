"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('config', () => ({
    environment: process.env.NODE_ENV,
    loggerLevel: process.env.LOGGER_LEVEL,
    port: process.env.PORT,
    pg: {
        host: "localhost",
        port: "5432",
        database: "test",
        username: "postgres",
        password: "myPassword",
    },
    saltRounds: parseInt(process.env.SALT_ROUNDS),
    sendGridAPIKey: process.env.SENDGRID_API_KEY,
    aws: {
        accessKeyID: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
    },
    jwt: {
        accessTokenSecret: process.env.JWT_SECRET,
        accessTokenExpiry: process.env.JWT_EXPIRY,
        refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
        refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY,
    },
    iex: {
        publicKey: process.env.IEX_PUBLIC_KEY,
        secretKey: process.env.IEX_SECRET_KEY,
        baseUrl: process.env.IEX_BASE_URL,
    },
    cityFalcon: {
        apiKey: process.env.CITY_FALCON_API_KEY,
        baseUrl: process.env.CITY_FALCON_BASE_URL,
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
}));
//# sourceMappingURL=configuration.js.map