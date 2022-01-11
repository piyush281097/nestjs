import { DatabaseModule } from 'src/database/database.module';

import { Module } from '@nestjs/common';

import { LoggerModule } from '../logger/logging.module';
import { SendgridService } from './sendgrid.service';

@Module({
  imports: [LoggerModule, DatabaseModule],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}
