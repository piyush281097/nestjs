import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { UtilsService } from '../utils/utils.service';
import { CityFalconModule } from './city-falcon/city-falcon.module';
import { IexModule } from './iex/iex.module';
import { LoggerModule } from './logger/logging.module';
import { S3Module } from './s3/s3.module';
import { SendgridModule } from './sendgrid/sendgrid.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule,
    SendgridModule,
    S3Module,
    IexModule,
    CityFalconModule,
  ],
  providers: [UtilsService],
  exports: [
    DatabaseModule,
    LoggerModule,
    UtilsService,
    SendgridModule,
    S3Module,
    IexModule,
    CityFalconModule,
  ],
})
export class SharedModule {}
