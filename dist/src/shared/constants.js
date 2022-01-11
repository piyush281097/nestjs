"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_EXTENSION = exports.S3_FOLDER_POSTS_ATTACHMENT = exports.S3_FOLDER_PROFILE_IMAGE = exports.S3_BUCKET = exports.IMAGE_FILE_EXTENSIONS = exports.INVESTMATES_EMAIL = exports.OTP_TYPES = exports.TAGGED_TYPE = exports.SOURCE_TYPES = exports.EMAIL_TYPES = exports.ERROR_CODES = exports.MAX_JSON_REQUEST_SIZE = void 0;
const common_1 = require("@nestjs/common");
exports.MAX_JSON_REQUEST_SIZE = 10485760;
exports.ERROR_CODES = {
    DEFAULT: {
        statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Unknown error occurred',
    },
};
exports.EMAIL_TYPES = {
    welcome_email: 'welcome_email',
    verify_otp: 'verify_otp',
    forgot_password: 'forgot_password',
    reset_password: 'reset_password',
};
exports.SOURCE_TYPES = {
    email: 'email',
    otp: 'otp',
    social: 'social',
};
exports.TAGGED_TYPE = {
    post: 'post',
    post_comment: 'post_comment',
    trade: 'trade',
    trade_comment: 'trade_comment',
};
exports.OTP_TYPES = {
    new_signup: 'new_signup',
    reset_password: 'reset_password',
    resend_signup: 'resend_signup',
};
exports.INVESTMATES_EMAIL = 'hello@investmates.io';
exports.IMAGE_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
exports.S3_BUCKET = 'investmates-images';
exports.S3_FOLDER_PROFILE_IMAGE = 'profile_image';
exports.S3_FOLDER_POSTS_ATTACHMENT = 'posts_attachment';
exports.IMAGE_EXTENSION = {
    thumbnail: '_t.',
    small: '_sm.',
    medium: '_md.',
    large: '_lg.',
};
//# sourceMappingURL=constants.js.map