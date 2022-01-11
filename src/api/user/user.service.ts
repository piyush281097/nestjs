import { forkJoin, from, map, Observable, switchMap } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import {
  EMAIL_TYPES,
  INVESTMATES_EMAIL,
  S3_BUCKET,
  S3_FOLDER_PROFILE_IMAGE,
  SOURCE_TYPES,
} from 'src/shared/constants';
import { Logger } from 'src/shared/logger/logging.service';

import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { OTP_TYPES } from '../../shared/constants';
import { S3Service } from '../../shared/s3/s3.service';
import { SendgridService } from '../../shared/sendgrid/sendgrid.service';
import { UtilsService } from '../../utils/utils.service';
import { AuthService } from '../auth/auth.service';
import { addOtpForUserDbQuery } from './db-query/add-otp-for-user.db-query';
import { addUserDbQuery } from './db-query/add-user.db-query';
import { getOtpByEmailDbQuery } from './db-query/get-otp-by-email.db-query';
import { getProfileDetailsDbQuery } from './db-query/get-profile-details.db-query';
import { getUserByEmailDbQuery } from './db-query/get-user-by-email.db-query';
import { resetPasswordDbQuery } from './db-query/reset-password.db-query';
import { searchUserDbQuery } from './db-query/search-users.db-query';
import { updateProfileImageDbQuery } from './db-query/update-profile-image.db-query';
import { UpdateUserIsDemoCompleteFlagDbQuery } from './db-query/update-user-demo-complete-bool.db-query';
import { UpdateUserIsSignupCompleteFlagDbQuery } from './db-query/update-user-signup-complete-bool.db-query';
import { verifyUserOtpAndAccountDbQuery } from './db-query/verify-user-otp-and-account.db-query';
import { GetOtpByEmailDbDto } from './dto/database/get-otp-by-email.db-dto';
import { GetUserByEmailDbDto } from './dto/database/get-user-by-email.db-dto';
import { UserCreateReturnDto } from './dto/database/user-create-return.db-dto';
import { LoginRequestDto } from './dto/request/login.request-dto';
import { ResetPasswordRequestDto } from './dto/request/reset-password.request-dto';
import { SignupRequestDto } from './dto/request/signup.request-dto';
import { UpdateProfileResponseDto } from './dto/request/update-profile.request-dto';
import { GetProfileDetailsResponseDto } from './dto/response/get-profile-details.response-dto';
import { SearchUsersResponseDto } from './dto/response/search-users.response-dto';
import { SignupResponseDto } from './dto/response/signup.response-dto';
import { welcomeVerifyOtp } from './templates/welcome_verify_otp';

@Injectable()
export class UserService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private sendGrid: SendgridService,
    private S3: S3Service,
    private logger: Logger,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    this.logger.setContext(UserService.name);
  }

  /**
   * 1, Add user to user_core & user_profile tables.
   * 2, Add generate OTP for account verification.
   * 3, Send OTP to user via email & add to otp_log
   */
  userSignup(signupRequest: SignupRequestDto): Observable<SignupResponseDto> {
    const { email, password, countryCode, firstName, lastName, phoneNumber } =
      signupRequest;
    const otp = Math.floor(Math.random() * 90000) + 10000;

    return forkJoin({
      password: from(
        UtilsService.generatePasswordHash(password, this.config.saltRounds),
      ),
      otp: from(
        UtilsService.generatePasswordHash(String(otp), this.config.saltRounds),
      ),
    }).pipe(
      switchMap(({ password, otp }) => {
        const userHandleTail = Math.floor(Math.random() * 90000) + 10000;

        const userHandle = signupRequest.userHandle
          ? signupRequest.userHandle
          : `${firstName}_${lastName}_${userHandleTail}`.toLowerCase();

        return this.db.rawQuery(
          addUserDbQuery,
          [
            email,
            password.hashedPassword,
            password.passwordSalt,
            countryCode,
            phoneNumber,
            firstName,
            lastName,
            SOURCE_TYPES.email,
            OTP_TYPES.new_signup,
            otp.hashedPassword,
            userHandle,
          ],
          UserCreateReturnDto,
        );
      }),
      switchMap((userId: [UserCreateReturnDto]) => {
        return this.sendSignupWelcomeEmailWithOTP(
          email,
          userId[0].userId,
          otp,
        ).pipe(
          map(() => {
            return {
              message: 'Signup Success. Please check your email',
            };
          }),
        );
      }),
    );
  }

  /**
   * To get user details from core and profile by email
   */
  getUserByEmail(email: string) {
    return this.db
      .rawQuery(getUserByEmailDbQuery, [email], GetUserByEmailDbDto)
      .pipe(map((res: [GetUserByEmailDbDto]) => res[0] ?? null));
  }

  userLogin(loginRequest: LoginRequestDto) {
    return this.authService.validateUser(loginRequest).pipe(
      map((userData) => {
        if (!userData) {
          throw new UnauthorizedException('Invalid Email or Password');
        }

        if (!userData.isVerified) {
          throw new ForbiddenException('Email is not verified');
        }
        return this.authService.login(userData);
      }),
    );
  }

  /**
   * Resend signup success verification OTP
   */
  resendUserVerificationOtp(email: string) {
    return this.getUserByEmail(email).pipe(
      switchMap((user) => {
        if (!user) {
          throw new ForbiddenException('Please provide a valid email');
        }
        const otp = Math.floor(Math.random() * 90000) + 10000;
        return from(
          UtilsService.generatePasswordHash(
            String(otp),
            this.config.saltRounds,
          ),
        ).pipe(
          map((hashedOtp) => ({
            otp: hashedOtp,
            otpRaw: otp,
            user,
          })),
        );
      }),
      switchMap(({ otp, otpRaw, user }) => {
        return this.db
          .rawQuery(
            addOtpForUserDbQuery,
            [
              user.userId,
              SOURCE_TYPES.email,
              OTP_TYPES.resend_signup,
              otp.hashedPassword,
            ],
            null,
          )
          .pipe(
            map(() => ({
              otp: otpRaw,
              user,
            })),
          );
      }),
      switchMap(({ otp, user }) => {
        return this.sendSignupWelcomeEmailWithOTP(
          user.email,
          user.userId,
          otp,
        ).pipe(
          map(() => {
            return {
              message: 'OTP resent. Please check your email',
            };
          }),
        );
      }),
    );
  }

  verifyAccountOTP(username: string, otp: number) {
    return this.db
      .rawQuery(getOtpByEmailDbQuery, [username], GetOtpByEmailDbDto)
      .pipe(
        switchMap((res: [GetOtpByEmailDbDto]) => {
          if (!res.length) {
            throw new NotFoundException('OTP or Email is invalid');
          }

          const { otpId, userId, otpHash } = res[0];
          return from(UtilsService.comparePassword(String(otp), otpHash)).pipe(
            map(() => ({ otpId, userId })),
          );
        }),
        switchMap(({ otpId, userId }) => {
          return this.db.rawQuery(
            verifyUserOtpAndAccountDbQuery,
            [otpId, userId],
            null,
          );
        }),
        map(() => {
          return {
            message: 'Account verified. Please login to continue',
          };
        }),
      );
  }

  forgotPassword(username: string) {
    const otp = Math.floor(Math.random() * 90000) + 10000;
    return forkJoin({
      hashedOtp: from(
        UtilsService.generatePasswordHash(String(otp), this.config.saltRounds),
      ),
      user: this.getUserByEmail(username),
    }).pipe(
      switchMap(({ hashedOtp, user }) => {
        if (!user) {
          throw new NotFoundException('Provided email is invalid');
        }
        return this.db
          .rawQuery(
            addOtpForUserDbQuery,
            [
              user.userId,
              SOURCE_TYPES.email,
              OTP_TYPES.reset_password,
              hashedOtp.hashedPassword,
            ],
            null,
          )
          .pipe(
            map(() => ({
              otp,
              user,
            })),
          );
      }),
      switchMap(({ user }) => {
        const email = {
          from: INVESTMATES_EMAIL,
          to: user.email,
          subject: 'Forgot Password - InvestMates',
          html: `<h1>Temp password - ${otp}</h1>`,
          text: `Temp password - ${otp}`,
        };
        return from(
          this.sendGrid.sendEmail({
            email,
            userId: user.userId,
            emailType: EMAIL_TYPES.forgot_password,
          }),
        );
      }),
      map(() => {
        return {
          message: 'Email with OTP sent. Please check your email',
        };
      }),
    );
  }

  /**
   * To validate OTP before calling reset password API
   */
  validateResetPasswordOTP(username: string, otp: number) {
    return this.db
      .rawQuery(getOtpByEmailDbQuery, [username], GetOtpByEmailDbDto)
      .pipe(
        switchMap((res: [GetOtpByEmailDbDto]) => {
          if (!res.length) {
            throw new ForbiddenException('Username or OTP is invalid');
          }
          return from(
            UtilsService.comparePassword(String(otp), res[0].otpHash),
          );
        }),
        map((isOtpValid) => {
          if (!isOtpValid) {
            throw new ForbiddenException('Username or OTP is invalid');
          }
          return {
            message: 'OTP is valid',
          };
        }),
      );
  }

  resetPassword({ username, otp, password }: ResetPasswordRequestDto) {
    return this.db
      .rawQuery(getOtpByEmailDbQuery, [username], GetOtpByEmailDbDto)
      .pipe(
        switchMap((res: [GetOtpByEmailDbDto]) => {
          if (!res.length) {
            throw new ForbiddenException('Username or OTP is invalid');
          }
          const { otpHash, otpId, userId } = res[0];
          return from(UtilsService.comparePassword(String(otp), otpHash)).pipe(
            map((isOtpValid) => ({ isOtpValid, userId, otpId })),
          );
        }),
        switchMap(({ isOtpValid, userId, otpId }) => {
          if (!isOtpValid) {
            throw new ForbiddenException('Username or OTP is invalid');
          }
          return from(
            UtilsService.generatePasswordHash(password, this.config.saltRounds),
          ).pipe(map((password) => ({ password, userId, otpId })));
        }),
        switchMap(({ password, userId, otpId }) => {
          return this.db.rawQuery(
            resetPasswordDbQuery,
            [password.hashedPassword, password.passwordSalt, userId, otpId],
            null,
          );
        }),
        map(() => ({
          message: 'Password reset success. Please login again.',
        })),
      );
  }

  getPreSignedUrlForProfilePicture(fileName: string, userId: number) {
    const fileSplit = fileName.split('.');

    return this.S3.getS3PreSignUrl({
      bucket: S3_BUCKET,
      filename: `${Date.now()}_${fileSplit[0]}_o.${fileSplit[1]}`,
      path: `${S3_FOLDER_PROFILE_IMAGE}/${userId}`,
    }).pipe(map(({ filePath, uploadUrl }) => ({ filePath, uploadUrl })));
  }

  updateProfileImageUrls(filePath: string, userId: number) {
    const { large, medium, original, small, thumbnail } =
      UtilsService.generateImagUrlForAllSizes(filePath);

    return this.db
      .rawQuery(
        updateProfileImageDbQuery,
        [userId, original, thumbnail, small, medium, large],
        null,
      )
      .pipe(map((res) => res[0] ?? {}));
  }

  getUserProfileDetails(loggedInUser: number, userId: number) {
    return this.db
      .rawQuery(
        getProfileDetailsDbQuery,
        [userId, loggedInUser],
        GetProfileDetailsResponseDto,
      )
      .pipe(map((details) => details[0] ?? {}));
  }

  updateIsSignupComplete(userId: number) {
    return this.db
      .rawQuery(UpdateUserIsSignupCompleteFlagDbQuery, [userId], null)
      .pipe(map(() => ({})));
  }

  updateIsDemoComplete(userId: number) {
    return this.db
      .rawQuery(UpdateUserIsDemoCompleteFlagDbQuery, [userId], null)
      .pipe(map(() => ({})));
  }
  /**
   * Splitting send signup success email function to reuse for resend OTP API
   */
  private sendSignupWelcomeEmailWithOTP(
    email: string,
    userId: number,
    otp: number,
  ) {
    return this.sendGrid.sendEmail({
      email: {
        to: email,
        from: INVESTMATES_EMAIL,
        subject: 'Welcome to Investmates',
        text: welcomeVerifyOtp.replace('OTP_HERE', String(otp)),
        html: welcomeVerifyOtp.replace('OTP_HERE', String(otp)),
      },
      userId,
      emailType: EMAIL_TYPES.welcome_email,
    });
  }

  searchUsers(query: string) {
    return this.db.rawQuery(
      searchUserDbQuery,
      [`${query}%`],
      SearchUsersResponseDto,
    );
  }

  updateProfile(userId: number, profile: UpdateProfileResponseDto) {
    const valuesArray = [userId];
    const queriesArray = [];

    const arrayToSkip = ['timeline', 'investmentStyle', 'interest'];
    const columnToSkip = [
      'createdAt',
      'lastUpdated',
      'password',
      'passwordSalt',
      'profileImage',
      'id',
      'userId',
      'isDeleted',
      'email',
      'isVerified',
      'isSignupComplete',
      'isActive',
      'userHandle',
      'experienceLevel',
    ];

    const addSQLQuery: Record<string, any> = {
      last_updated: 'current_timestamp',
    };
    /**
     * Updating original post master data and wiping and reinserting other data
     */
    const { query, data } = UtilsService.buildUpdateQuery({
      tableName: 'user_profile',
      columnData: profile,
      keysToIgnore: [...arrayToSkip, ...columnToSkip],
      keysToReplace: { isDeleted: false },
      addSqlQuery: addSQLQuery,
      whereCondition: 'user_id = $1',
      start: 2,
    });

    queriesArray.push(`upd_user_profile as (${query} RETURNING *)`);
    valuesArray.push(...data);

    /**
     * Update userHandle in user core table
     */
    if (profile.userHandle) {
      const { query, data } = UtilsService.buildUpdateQuery({
        tableName: 'user_core',
        columnData: {
          userHandle: profile.userHandle,
        },
        keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
        whereCondition: 'id = $1',
        start: valuesArray.length + 1,
      });

      queriesArray.push(`upd_user_core as (${query})`);
      valuesArray.push(...data);
    }

    /**
     * Update Experience Level in user core table
     */
    if (profile.experienceLevel) {
      queriesArray.push(
        `del_user_experience as (DELETE from user_experience where user_id = $1)`,
      );
      const { query, data } = UtilsService.buildInsertQuery({
        tableName: 'user_experience',
        columnData: [
          {
            experienceId: profile.experienceLevel,
          },
        ],
        keysToIgnore: ['id', 'createdAt', 'lastUpdated'],
        addSqlQuery: {
          user_id: '$1',
        },
        start: valuesArray.length + 1,
      });

      queriesArray.push(`ins_user_experience as (${query})`);
      valuesArray.push(...data);
    }

    /**
     * Remove and Add Timeline
     */
    if (Array.isArray(profile.timeline)) {
      queriesArray.push(
        `del_timeline as (DELETE from investment_timeline where user_id = $1)`,
      );

      if (profile.timeline?.length) {
        const { query, data } = UtilsService.buildInsertQuery({
          tableName: 'investment_timeline',
          columnData: profile.timeline,
          keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'userId'],
          addSqlQuery: {
            user_id: '$1',
          },
          start: valuesArray.length + 1,
        });

        queriesArray.push(`ins_timeline as (${query})`);
        valuesArray.push(...data);
      }
    }

    /**
     * Add Investment Style
     */
    if (Array.isArray(profile.investmentStyle)) {
      queriesArray.push(
        `del_investment_style as (DELETE from user_investment_types where user_id = $1)`,
      );

      if (profile.investmentStyle?.length) {
        const { query, data } = UtilsService.buildInsertQuery({
          tableName: 'user_investment_types',
          columnData: profile.investmentStyle.map((x) => ({ investmentId: x })),
          keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
          addSqlQuery: {
            user_id: '$1',
          },
          start: valuesArray.length + 1,
        });

        queriesArray.push(`ins_user_investment_types as (${query})`);
        valuesArray.push(...data);
      }
    }

    /**
     * Add interests
     */
    if (Array.isArray(profile.interest)) {
      queriesArray.push(
        `del_user_interest as (DELETE from user_interests where user_id = $1)`,
      );

      if (profile.interest?.length) {
        const { query, data } = UtilsService.buildInsertQuery({
          tableName: 'user_interests',
          columnData: profile.interest.map((x) => ({ interestsId: x })),
          keysToIgnore: ['id', 'createdAt', 'lastUpdated', 'postId'],
          addSqlQuery: {
            user_id: '$1',
          },
          start: valuesArray.length + 1,
        });

        queriesArray.push(`ins_user_interest as (${query})`);
        valuesArray.push(...data);
      }
    }

    return this.db
      .rawQuery(
        `WITH ${queriesArray.join(
          ', ',
        )} (select user_id from upd_user_profile) `,
        valuesArray,
        null,
      )
      .pipe(map((res) => res[0]));
  }
}
