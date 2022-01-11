import { HttpStatus } from '@nestjs/common';
export declare const MAX_JSON_REQUEST_SIZE = 10485760;
export declare const ERROR_CODES: {
    DEFAULT: {
        statusCode: HttpStatus;
        message: string;
    };
};
export declare const EMAIL_TYPES: {
    welcome_email: string;
    verify_otp: string;
    forgot_password: string;
    reset_password: string;
};
export declare const SOURCE_TYPES: {
    email: string;
    otp: string;
    social: string;
};
export declare const TAGGED_TYPE: {
    post: string;
    post_comment: string;
    trade: string;
    trade_comment: string;
};
export declare const OTP_TYPES: {
    new_signup: string;
    reset_password: string;
    resend_signup: string;
};
export declare const INVESTMATES_EMAIL = "hello@investmates.io";
export declare const IMAGE_FILE_EXTENSIONS: string[];
export declare const S3_BUCKET = "investmates-images";
export declare const S3_FOLDER_PROFILE_IMAGE = "profile_image";
export declare const S3_FOLDER_POSTS_ATTACHMENT = "posts_attachment";
export declare const IMAGE_EXTENSION: {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
};
