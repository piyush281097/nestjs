import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [SharedModule],
  controllers: [RoomController],
  providers: [RoomService]
})
export class RoomModule {}
