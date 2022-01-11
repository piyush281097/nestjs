import { config } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import configuration from 'src/config/configuration';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
  ) {
    super({
      clientID: '116117069980-9engdulupkb8cjgtitj4k0vbimsecguk.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
