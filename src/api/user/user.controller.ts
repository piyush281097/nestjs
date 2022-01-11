import { Observable } from 'rxjs';

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUser } from '../../utils/decorator/user-token-payload.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.auth-guard';
import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { ForgotPasswordRequestDto } from './dto/request/forgot-password.request-dto';
import { LoginRequestDto } from './dto/request/login.request-dto';
import { ProfileImageUpdateUrlRequestDto } from './dto/request/profile-image-update-url.request-dto';
import { ResendOtpSignupRequestDto } from './dto/request/resend-otp-signup.request-dto';
import { ResetPasswordRequestDto } from './dto/request/reset-password.request-dto';
import { SignupRequestDto } from './dto/request/signup.request-dto';
import { UpdateProfileResponseDto } from './dto/request/update-profile.request-dto';
import { UploadProfileImageRequestDto } from './dto/request/upload-profile-image.request-dto';
import { ValidateResetPasswordOtpRequestDto } from './dto/request/validate-reset-password-otp.request-dto';
import { VerifyAccountOtpRequestDto } from './dto/request/verify-account-otp.request-dto';
import { ForgotPasswordResponseDto } from './dto/response/forgot-password.response-dto';
import { GetProfileDetailsResponseDto } from './dto/response/get-profile-details.response-dto';
import { LoginResponseDto } from './dto/response/login.response-dto';
import { ProfileImageUpdateUrlResponseDto } from './dto/response/profile-image-update-url.response-dto';
import { ResendOtpSignupResponseDto } from './dto/response/resend-otp-signup.request-dto';
import { ResetPasswordResponseDto } from './dto/response/reset-password.response-dto';
import { SearchUsersResponseDto } from './dto/response/search-users.response-dto';
import { SignupResponseDto } from './dto/response/signup.response-dto';
import { UploadProfileImageResponseDto } from './dto/response/upload-profile-image.response-dto';
import { ValidateResetPasswordOtpResponseDto } from './dto/response/validate-reset-password-otp.response-dto';
import { VerifyAccountOtpResponseDto } from './dto/response/verify-account-otp.request-dto';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: SignupRequestDto })
  @ApiResponse({ type: SignupResponseDto })
  CreateUser(
    @Body() signupRequest: SignupRequestDto,
  ): Observable<SignupResponseDto> {
    return this.userService.userSignup(signupRequest);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ type: LoginResponseDto })
  UserLogin(
    @Body() loginRequest: LoginRequestDto,
  ): Observable<LoginResponseDto> {
    return this.userService.userLogin(loginRequest);
  }

  @Post('resend-signup-verification-otp')
  @ApiOperation({ summary: 'To resend signup verification OTP via email' })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: ResendOtpSignupRequestDto })
  @ApiResponse({ type: ResendOtpSignupResponseDto })
  ResendSignupVerificationOTP(
    @Body() otpRequest: ResendOtpSignupRequestDto,
  ): Observable<SignupResponseDto> {
    return this.userService.resendUserVerificationOtp(otpRequest.username);
  }

  @Post('verify-signup-otp')
  @ApiOperation({
    summary: 'To mark the user account as verified by verifying otp',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: VerifyAccountOtpRequestDto })
  @ApiResponse({ type: VerifyAccountOtpResponseDto })
  VerifySignupOTP(
    @Body() body: VerifyAccountOtpRequestDto,
  ): Observable<VerifyAccountOtpResponseDto> {
    return this.userService.verifyAccountOTP(body.username, body.otp);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Generate and will sent OTP to the given email address',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: ForgotPasswordRequestDto })
  @ApiResponse({ type: ForgotPasswordResponseDto })
  ForgotPassword(
    @Body() body: ForgotPasswordRequestDto,
  ): Observable<ForgotPasswordResponseDto> {
    return this.userService.forgotPassword(body.username);
  }

  @Post('validate-reset-password-otp')
  @ApiOperation({
    summary: 'To check OTP is correct or not. NOT TO MARK AS VERIFIED',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: ValidateResetPasswordOtpRequestDto })
  @ApiResponse({ type: ValidateResetPasswordOtpResponseDto })
  ValidateResetPasswordOtp(
    @Body() body: ValidateResetPasswordOtpRequestDto,
  ): Observable<ValidateResetPasswordOtpResponseDto> {
    return this.userService.validateResetPasswordOTP(body.username, body.otp);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'To verify OTP and to update new password',
  })
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: ResetPasswordRequestDto })
  @ApiResponse({ type: ResetPasswordResponseDto })
  ResetPassword(
    @Body() body: ResetPasswordRequestDto,
  ): Observable<ResetPasswordResponseDto> {
    const { otp, password, username } = body;

    return this.userService.resetPassword({
      otp,
      password,
      username,
    });
  }

  @Post('profile-picture')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'This will generate presigned S3 URL for profile picture',
  })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({ type: UploadProfileImageRequestDto })
  @ApiResponse({ type: UploadProfileImageResponseDto })
  GetPreSignedUrlForProfilePicture(
    @AuthUser() user: DecodedTokenPayload,
    @Body() body: UploadProfileImageRequestDto,
  ): Observable<UploadProfileImageResponseDto> {
    return this.userService.getPreSignedUrlForProfilePicture(
      body.fileName,
      user.userId,
    );
  }

  @Put('profile-picture')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Pass the "filePath" from POST /profile-picture API response in order to update the image url in database',
  })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({ type: ProfileImageUpdateUrlRequestDto })
  @ApiResponse({ type: ProfileImageUpdateUrlResponseDto })
  UpdateProfilePictureURL(
    @AuthUser() user: DecodedTokenPayload,
    @Body() body: ProfileImageUpdateUrlRequestDto,
  ): Observable<ProfileImageUpdateUrlResponseDto> {
    return this.userService.updateProfileImageUrls(body.filePath, user.userId);
  }

  @Get('details')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User Profile of the logged in person',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetProfileDetailsResponseDto })
  GetUserProfileDetails(
    @AuthUser() user: DecodedTokenPayload,
  ): Observable<GetProfileDetailsResponseDto> {
    return this.userService.getUserProfileDetails(user.userId, user.userId);
  }

  @Get('details/:userId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User Profile of the other user',
  })
  @ApiParam({ name: 'userId', type: Number })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: GetProfileDetailsResponseDto })
  GetUserProfileDetailsOfOtherUser(
    @AuthUser() user: DecodedTokenPayload,
    @Param('userId', ParseIntPipe) userId: number,
  ): Observable<GetProfileDetailsResponseDto> {
    return this.userService.getUserProfileDetails(user.userId, userId);
  }

  @Patch('details')
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe({}))
  @ApiOperation({
    summary: 'Update User Profile of the logged in person',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateProfileResponseDto })
  UpdateUserProfileDetails(
    @AuthUser() user: DecodedTokenPayload,
    @Body() profile: UpdateProfileResponseDto,
  ): Observable<GetProfileDetailsResponseDto> {
    return this.userService.updateProfile(user.userId, profile);
  }

  @Put('is-signup-complete')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Flag to update after initial screens are shown',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: Object })
  UpdateIsSignupComplete(
    @AuthUser() user: DecodedTokenPayload,
  ): Observable<Record<null, null>> {
    return this.userService.updateIsSignupComplete(user.userId);
  }

  @Put('is-demo-complete')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Flag to update after demo screens are shown',
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: Object })
  UpdateIsDemoComplete(
    @AuthUser() user: DecodedTokenPayload,
  ): Observable<Record<null, null>> {
    return this.userService.updateIsDemoComplete(user.userId);
  }

  @Get('search')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Search user by username or handle',
  })
  @ApiQuery({ name: 'query', description: 'Username or User handle' })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: [SearchUsersResponseDto] })
  SearchUsers(
    @AuthUser() user: DecodedTokenPayload,
    @Query('query') query: string,
  ): Observable<SearchUsersResponseDto[]> {
    return this.userService.searchUsers(query);
  }
}
