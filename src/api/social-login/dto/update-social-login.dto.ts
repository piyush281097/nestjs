import { PartialType } from '@nestjs/swagger';
import { CreateSocialLoginDto } from './create-social-login.dto';

export class UpdateSocialLoginDto extends PartialType(CreateSocialLoginDto) {}
