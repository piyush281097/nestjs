import { SharedModule } from 'src/shared/shared.module';

import { Module } from '@nestjs/common';

import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [SharedModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
