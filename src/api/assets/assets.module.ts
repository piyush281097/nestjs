import { Module } from '@nestjs/common';

import { SharedModule } from '../../shared/shared.module';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';

@Module({
  imports: [SharedModule],
  controllers: [AssetsController],
  providers: [AssetsService],
})
export class AssetsModule {}
