import configuration from 'src/config/configuration';

import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SharedModule } from '../../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigType<typeof configuration>) => ({
        secret: config.jwt.accessTokenSecret,
        signOptions: { expiresIn: config.jwt.accessTokenExpiry },
      }),
      inject: [configuration.KEY],
    }),
    PassportModule,
    forwardRef(() => UserModule),
    SharedModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
