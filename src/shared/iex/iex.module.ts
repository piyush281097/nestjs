import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { LoggerModule } from '../logger/logging.module';
import { IexService } from './iex.service';

@Module({
  imports: [LoggerModule, HttpModule],
  exports: [IexService],
  providers: [IexService],
})
export class IexModule {}
