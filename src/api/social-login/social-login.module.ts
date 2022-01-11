import { SharedModule } from 'src/shared/shared.module';

import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { GoogleStrategy } from '../auth/strategies/google.strategy';
import { SocialLoginController } from './social-login.controller';
import { SocialLoginService } from './social-login.service';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [SocialLoginController],
  providers: [SocialLoginService, GoogleStrategy],
})
export class SocialLoginModule {}
