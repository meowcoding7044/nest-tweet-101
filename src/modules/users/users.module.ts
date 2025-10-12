import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/infrastructure/database/entities/profile.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { BcryptHashProvider } from 'src/infrastructure/providers/hash';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';


@Module({
  controllers: [UsersController],
  providers: [UsersService,UsersRepository,BcryptHashProvider],
  exports: [UsersService,UsersRepository],
  imports: [
    TypeOrmModule.forFeature([UserEntity, Profile]),
    PaginationModule,
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
