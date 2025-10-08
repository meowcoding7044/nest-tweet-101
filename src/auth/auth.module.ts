import { Module,forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[forwardRef(()=>UsersModule),
    ConfigModule.forFeature(authConfig)
  ],
  exports:[AuthService]
})
export class AuthModule {}
