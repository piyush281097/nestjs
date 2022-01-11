declare const _default: (() => {
    environment: string;
    loggerLevel: string;
    port: string;
    pg: {
        host: string;
        port: string;
        database: string;
        username: string;
        password: string;
    };
    saltRounds: number;
    sendGridAPIKey: string;
    aws: {
        accessKeyID: string;
        secretAccessKey: string;
        region: string;
    };
    jwt: {
        accessTokenSecret: string;
        accessTokenExpiry: string;
        refreshTokenSecret: string;
        refreshTokenExpiry: string;
    };
    iex: {
        publicKey: string;
        secretKey: string;
        baseUrl: string;
    };
    cityFalcon: {
        apiKey: string;
        baseUrl: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    environment: string;
    loggerLevel: string;
    port: string;
    pg: {
        host: string;
        port: string;
        database: string;
        username: string;
        password: string;
    };
    saltRounds: number;
    sendGridAPIKey: string;
    aws: {
        accessKeyID: string;
        secretAccessKey: string;
        region: string;
    };
    jwt: {
        accessTokenSecret: string;
        accessTokenExpiry: string;
        refreshTokenSecret: string;
        refreshTokenExpiry: string;
    };
    iex: {
        publicKey: string;
        secretKey: string;
        baseUrl: string;
    };
    cityFalcon: {
        apiKey: string;
        baseUrl: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
}>;
export default _default;
