import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { BcryptHashProvider } from '../../infrastructure/providers/hash/bcrypt.provider';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import {
  AUTH_CONFIG,
  HASH_PROVIDER,
  TOKEN_PROVIDER,
  USERS_REPOSITORY,
} from '../../common/constants/tokens';
import { JwtTokenProvider } from 'src/infrastructure/providers/jwt/jwt.provider';
import { IAuthConfig } from 'src/core/interfaces/config-provider.interface';
import authConfig from '../../config/auth.config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: AUTH_CONFIG,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<IAuthConfig>('auth'),
    },
    {
      provide: TOKEN_PROVIDER,
      useFactory: (
        jwtService: JwtService,
        authConfigs: ConfigType<typeof authConfig>,
      ) => new JwtTokenProvider(jwtService, authConfigs),
      inject: [JwtService, AUTH_CONFIG],
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
    {
      provide: HASH_PROVIDER,
      useClass: BcryptHashProvider,
    },
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync(authConfig.asProvider()),
  ],
  exports: [AuthService],
})
export class AuthModule {}
