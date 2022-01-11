import { from, map, Observable, of, switchMap } from 'rxjs';
import { UtilsService } from 'src/utils/utils.service';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { GetUserByEmailWithPassword } from '../user/dto/database/get-user-by-email.db-dto';
import { LoginRequestDto } from '../user/dto/request/login.request-dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  validateUser(
    loginRequest: LoginRequestDto,
  ): Observable<GetUserByEmailWithPassword | null> {
    const { username, password } = loginRequest;

    return this.usersService.getUserByEmail(username).pipe(
      switchMap((user) => {
        if (!user) {
          return of(null);
        }
        return from(UtilsService.comparePassword(password, user.password)).pipe(
          map((isPasswordCorrect) => {
            if (!isPasswordCorrect) {
              return null;
            }
            /**
             * To avoid password being sent to frontend
             */
            delete user.password;
            delete user.passwordSalt;

            return user;
          }),
        );
      }),
    );
  }

  login(user: any) {
    const payload = { username: user.email, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
