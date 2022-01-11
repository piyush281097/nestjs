"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const package_json_1 = require("../package.json");
const app_module_1 = require("./app.module");
const request_logger_1 = require("./middlewares/request-logger");
const logging_service_1 = require("./shared/logger/logging.service");
const utils_service_1 = require("./utils/utils.service");
async function bootstrap() {
    const logger = new logging_service_1.Logger('main');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useLogger(logger);
    (0, request_logger_1.useRequestLogging)(app);
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    const config = app.get(config_1.ConfigService);
    const port = config.get('config.port');
    const env = config.get('config.environment');
    app.setGlobalPrefix('/api', {
        exclude: [{ path: '/api-docs', method: common_1.RequestMethod.GET }],
    });
    if (process.env.NODE_ENV !== 'production') {
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
    }
    if (process.env.SWAGGER_SERVER === 'true') {
        const options = new swagger_1.DocumentBuilder()
            .setTitle(utils_service_1.UtilsService.convertStringToSentenceCase(package_json_1.name.replace(/-/gi, ' ')))
            .setDescription(`${package_json_1.description}\nRunning on ${process.env.NODE_ENV} Mode`)
            .setVersion(package_json_1.version)
            .addServer(`http://${process.env.LOCALHOST}:${process.env.PORT}`, 'Local Dev Server')
            .addServer(`http://${process.env.DEV_SERVER_URL}`, 'Remote Dev Server')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup('api-docs', app, document, {
            uiConfig: { defaultModelsExpandDepth: -1 },
        });
    }
    await app.listen(port, '0.0.0.0');
    logger.log(`Listening on port ${port}, running in ${env} environment`);
}
bootstrap();
//# sourceMappingURL=main.js.map