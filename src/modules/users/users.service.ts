import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';

import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { BcryptHashProvider } from '../../infrastructure/providers/hash/bcrypt.provider';
import { CreateUserUseCase } from 'src/core/use-cases/user/create-user.usecase';
import { UserModel } from 'src/core/entities/user/user.model';
import { CreateUserDto } from 'src/modules/users/dtos/create-user.dto';
import { GetUsersUseCase } from 'src/core/use-cases/user/get-users.usecase';
import { USERS_REPOSITORY } from 'src/common/constants/tokens';
import type { IUsersRepository } from 'src/core/domain/user/users-repository.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly createUserUC: CreateUserUseCase,
    private readonly getUsersUC: GetUsersUseCase,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: IUsersRepository,
  ) {}

  async getUsers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<UserModel | null>> {
    return await this.getUsersUC.execute(paginationQueryDto);
  }

  async createUser(dto: CreateUserDto) {
    console.log("createUser service : ",dto)
    return this.createUserUC.execute(dto);
  }

  async deleteUser(id: number) {
    await this.usersRepo.deleteUser(id);
    return { deleted: true };
  }

  async findUserById(id: number) {
    const user = await this.usersRepo.findById(id);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `User with ID ${id} not found.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async findUserByUsername(username: string) {
    const user = await this.usersRepo.findByUsername(username);
    if (!user) throw new UnauthorizedException('User does not exist!');
    return user;
  }
}
