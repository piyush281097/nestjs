import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { LoggerModule } from '../logger/logging.module';
import { SesService } from './ses.service';

@Module({
  imports: [LoggerModule, DatabaseModule],
  providers: [SesService],
  exports: [SesService],
})
export class SesModule {}
