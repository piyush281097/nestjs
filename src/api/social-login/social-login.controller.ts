import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { SocialLoginService } from './social-login.service';

@Controller('social-login')
export class SocialLoginController {
  constructor(private readonly socialLoginService: SocialLoginService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.socialLoginService.googleLogin(req);
  }
}
