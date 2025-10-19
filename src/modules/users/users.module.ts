import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { User } from '../../infrastructure/database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from 'src/infrastructure/database/entities/profile.entity';
//import { PaginationModule } from 'src/common/pagination/pagination.module';
import { BcryptHashProvider } from 'src/infrastructure/providers/hash';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { CreateUserUseCase } from 'src/core/use-cases/user/create-user.usecase';
import { GetUsersUseCase } from 'src/core/use-cases/user/get-users.usecase';
import { PaginationProvider } from 'src/infrastructure/providers/pagination/pagination.provider';
import { USERS_REPOSITORY } from 'src/common/constants/tokens';

const providers = [
  UsersService,
  PaginationProvider,
  BcryptHashProvider,
  {
    provide: USERS_REPOSITORY,
    useClass: UsersRepository,
  },
  {
    provide: CreateUserUseCase,
    useFactory: (
      usersRepo: UsersRepository,
      hashProvider: BcryptHashProvider,
    ) => new CreateUserUseCase(usersRepo, hashProvider),
    inject: [USERS_REPOSITORY, BcryptHashProvider],
  },
  {
    provide: GetUsersUseCase,
    useFactory: (usersRepo: UsersRepository) => new GetUsersUseCase(usersRepo),
    inject: [USERS_REPOSITORY],
  }
];
@Module({
  controllers: [UsersController],
  providers: providers,
  exports: [UsersService, PaginationProvider, TypeOrmModule],
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    forwardRef(() => AuthModule),
  ],
})
export class UsersModule {}
