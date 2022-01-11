import { HttpStatus } from '@nestjs/common';

// Updating limit from 1MB to 10MB which is maximum supported by AWS APIGateway
export const MAX_JSON_REQUEST_SIZE = 10485760;

// Custom Error codes with messages to be send
export const ERROR_CODES = {
  DEFAULT: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Unknown error occurred',
  },
};

//  Email types to store in email_log table
export const EMAIL_TYPES = {
  welcome_email: 'welcome_email',
  verify_otp: 'verify_otp',
  forgot_password: 'forgot_password',
  reset_password: 'reset_password',
};

export const SOURCE_TYPES = {
  email: 'email',
  otp: 'otp',
  social: 'social',
};

export const TAGGED_TYPE = {
  post: 'post',
  post_comment: 'post_comment',
  trade: 'trade',
  trade_comment: 'trade_comment',
};

export const OTP_TYPES = {
  new_signup: 'new_signup',
  reset_password: 'reset_password',
  resend_signup: 'resend_signup',
};

//  Investmates email to be used through out the application
export const INVESTMATES_EMAIL = 'hello@investmates.io';

// Supported image file extensions
export const IMAGE_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

export const S3_BUCKET = 'investmates-images';
export const S3_FOLDER_PROFILE_IMAGE = 'profile_image';
export const S3_FOLDER_POSTS_ATTACHMENT = 'posts_attachment';

export const IMAGE_EXTENSION = {
  thumbnail: '_t.',
  small: '_sm.',
  medium: '_md.',
  large: '_lg.',
  // original: '_o.',
};
