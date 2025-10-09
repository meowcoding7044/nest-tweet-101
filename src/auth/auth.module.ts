import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import authConfig from './config/auth.config';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  imports: [forwardRef(() => UsersModule), ConfigModule.forFeature(authConfig)],
  exports: [AuthService,HashingProvider],
})
export class AuthModule {}
