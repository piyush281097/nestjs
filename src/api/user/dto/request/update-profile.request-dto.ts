import { ArrayUnique, IsArray, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class Timeline {
  @ApiProperty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsString()
  from: string;

  @ApiProperty()
  @IsString()
  activity: string;

  @ApiProperty()
  @IsString()
  investorName: string;
}

export class UpdateProfileResponseDto {
  @ApiProperty()
  @IsString()
  userHandle?: string;

  @ApiProperty()
  @IsNumber()
  experienceLevel: number;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  quote: string;

  @ApiProperty()
  @IsString()
  about: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  goal: [string];

  @ApiProperty({ type: [Timeline] })
  timeline: Timeline[];

  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @ArrayUnique((o: any) => o)
  investmentStyle: number[];

  @ApiProperty({ type: [Number] })
  @ArrayUnique((o: any) => o)
  interest: number[];
}
