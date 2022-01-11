import { Module } from '@nestjs/common';
import { Logger } from './logging.service';

@Module({
  imports: [],
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
