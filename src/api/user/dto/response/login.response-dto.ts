import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty()
  email: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  userHandle?: any;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  mobileNumber: string;

  @ApiProperty()
  isDeleted?: any;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastUpdated: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  quote?: string;

  @ApiProperty()
  about?: string;

  @ApiProperty()
  goal?: string;
}

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;
}
