import { map, of, switchMap } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { SOURCE_TYPES } from 'src/shared/constants';
import { Logger } from 'src/shared/logger/logging.service';

import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { AuthService } from '../auth/auth.service';
import {
  addUserDbQuery,
  addUserSocialLoginDbQuery,
} from '../user/db-query/add-user.db-query';
import { getUserByEmailDbQuery } from '../user/db-query/get-user-by-email.db-query';
import { GetUserByEmailDbDto } from '../user/dto/database/get-user-by-email.db-dto';
import { UserCreateReturnDto } from '../user/dto/database/user-create-return.db-dto';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}
export interface GetUserCoreByEmail {
  id: string;
  isSocialLogin: boolean;
}
export interface GoogleLoginResponse {
  user: User;
}
@Injectable()
export class SocialLoginService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private logger: Logger,
    private authService: AuthService,
  ) {
    this.logger.setContext(SocialLoginService.name);
  }

  googleLogin(req: GoogleLoginResponse) {
    if (!req.user) {
      return 'No user from google';
    }
    const { accessToken, email, firstName, lastName, picture } = req.user;
    /**
     * 1, Get user by email id
     * 2, Add if not. Add in user_profile as well.
     * 2.b, if found and dont want to include in api
     * 3, Create/generate token based on the social login
     */

    return this.db
      .rawQuery(getUserByEmailDbQuery, [email], GetUserByEmailDbDto)
      .pipe(
        map((res: [GetUserByEmailDbDto]) => res[0] ?? null),
        switchMap((res) => {
          if (!res) {
            const userHandleTail = Math.floor(Math.random() * 90000) + 10000;
            const userHandle =
              `${firstName}_${lastName}_${userHandleTail}`.toLowerCase();

            return this.db
              .rawQuery(
                addUserSocialLoginDbQuery,
                [email, firstName, lastName, userHandle],
                UserCreateReturnDto,
              )
              .pipe(
                switchMap(() => {
                  return this.db
                    .rawQuery(
                      getUserByEmailDbQuery,
                      [email],
                      GetUserByEmailDbDto,
                    )
                    .pipe(map((res: [GetUserByEmailDbDto]) => res[0] ?? null));
                }),
              );
          } else {
            if (!res.isSocialLogin) {
              throw new ForbiddenException(
                'Email already exists! Try login via email method',
              );
            }

            return of(res);
          }
        }),
        map((user) => {
          return this.authService.login(user);
        }),
      );
  }
}
