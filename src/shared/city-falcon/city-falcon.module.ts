import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { LoggerModule } from '../logger/logging.module';
import { CityFalconService } from './city-falcon.service';

@Module({
  imports: [LoggerModule, HttpModule],
  exports: [CityFalconService],
  providers: [CityFalconService],
})
export class CityFalconModule {}
