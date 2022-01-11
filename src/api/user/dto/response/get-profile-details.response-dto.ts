import { ApiProperty } from '@nestjs/swagger';

export class ProfileImage {
  @ApiProperty()
  imageOrg: string;

  @ApiProperty()
  imageThumb: string;

  @ApiProperty()
  imageSmall: string;

  @ApiProperty()
  imageMedium: string;

  @ApiProperty()
  imageLarge: string;
}
export class Timeline {
  @ApiProperty()
  to: string;

  @ApiProperty()
  from: string;

  @ApiProperty()
  activity: string;

  @ApiProperty()
  investorName: string;
}

export class InvestmentStyle {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;
}

export class Interest {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;
}
export class GetProfileDetailsResponseDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  followingCount: number;

  @ApiProperty()
  followersCount: number;

  @ApiProperty()
  isFollowing: boolean;

  @ApiProperty()
  isBeingFollowed: boolean;

  @ApiProperty()
  userHandle?: string;

  @ApiProperty()
  experienceLevel?: string;

  @ApiProperty()
  isSignupComplete: boolean;

  @ApiProperty()
  countryCode: string;

  @ApiProperty()
  mobileNumber: string;

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

  @ApiProperty()
  profileImage: ProfileImage;

  @ApiProperty({ type: [Timeline] })
  timeline: Timeline[];

  @ApiProperty({ type: [InvestmentStyle] })
  investmentStyle: InvestmentStyle[];

  @ApiProperty({ type: [Interest] })
  interest: Interest[];
}
