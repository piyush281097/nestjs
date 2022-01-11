import { Module } from '@nestjs/common';

import { SharedModule } from '../../shared/shared.module';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [SharedModule],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
