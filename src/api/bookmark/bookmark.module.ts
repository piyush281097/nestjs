import { SharedModule } from 'src/shared/shared.module';

import { Module } from '@nestjs/common';

import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [SharedModule],
  controllers: [BookmarkController],
  providers: [BookmarkService],
})
export class BookmarkModule {}
