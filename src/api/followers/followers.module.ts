import { Module } from '@nestjs/common';

import { SharedModule } from '../../shared/shared.module';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

@Module({
  imports: [SharedModule],
  controllers: [FollowersController],
  providers: [FollowersService],
})
export class FollowersModule {}
