import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { User } from '../../infrastructure/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/infrastructure/database/entities/profile.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';


@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    PaginationModule,
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
