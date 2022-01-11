import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

export interface DecodedTokenPayload {
  userId: number;
  username: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "myjwt",
    });
  }

  async validate(payload: any): Promise<{ userId: any; username: any }> {
    return { userId: payload.sub, username: payload.username };
  }
}
