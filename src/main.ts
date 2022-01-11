import { RequestMethod, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { description, name, version } from '../package.json';
import { AppModule } from './app.module';
import { useRequestLogging } from './middlewares/request-logger';
import { Logger } from './shared/logger/logging.service';
import { UtilsService } from './utils/utils.service';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(logger);
  useRequestLogging(app);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('config.port');
  const env = config.get('config.environment');

  app.setGlobalPrefix('/api', {
    exclude: [{ path: '/api-docs', method: RequestMethod.GET }],
  });

  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
  }
  // Swagger Configuration
  if (process.env.SWAGGER_SERVER === 'true') {
    const options = new DocumentBuilder()
      .setTitle(
        UtilsService.convertStringToSentenceCase(name.replace(/-/gi, ' ')),
      )
      .setDescription(`${description}\nRunning on ${process.env.NODE_ENV} Mode`)
      .setVersion(version)
      .addServer(
        `http://${process.env.LOCALHOST}:${process.env.PORT}`,
        'Local Dev Server',
      )
      .addServer(`http://${process.env.DEV_SERVER_URL}`, 'Remote Dev Server')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api-docs', app, document, {
      uiConfig: { defaultModelsExpandDepth: -1 },
    });
  }
  await app.listen(port, '0.0.0.0');
  logger.log(`Listening on port ${port}, running in ${env} environment`);
}

bootstrap();
