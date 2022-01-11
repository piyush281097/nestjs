import { SharedModule } from 'src/shared/shared.module';

import { Module } from '@nestjs/common';

import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';

@Module({
  imports: [SharedModule],
  controllers: [TradesController],
  providers: [TradesService],
})
export class TradesModule {}
