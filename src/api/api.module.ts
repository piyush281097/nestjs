import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { PostsModule } from './posts/posts.module';
import { AssetsModule } from './assets/assets.module';
import { TradesModule } from './trades/trades.module';
import { FollowersModule } from './followers/followers.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { SocialLoginModule } from './social-login/social-login.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RoomModule} from './room/room.module';

@Module({
  imports: [UserModule, CommonModule, PostsModule, AssetsModule, TradesModule, FollowersModule, PortfolioModule, BookmarkModule, SocialLoginModule, NotificationsModule,RoomModule],
})
export class ApiModule {}
