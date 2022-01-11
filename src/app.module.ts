import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import validationSchema from './config/validation';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './shared/logger/logging.module';
import { SharedModule } from './shared/shared.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ApiModule } from './api/api.module';
import { ChatGateway } from './chat.gateway';
// import { RoomModule } from './api/room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    ApiModule,
    LoggerModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    ChatGateway,
  ],
})
export class AppModule {}
