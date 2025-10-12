import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEntity } from '../../infrastructure/database/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { UsersRepository } from 'src/infrastructure/database/repositories/users.repository';
import { BcryptHashProvider } from '../../infrastructure/providers/hash/bcrypt.provider';
import { CreateUserUseCase } from 'src/core/use-cases/create-user.usecase';
import { UserModel } from 'src/core/entities/user.model';
import { CreateUserModel } from 'src/core/entities/create-user.model';
import { GetUsersUseCase } from 'src/core/use-cases/get-users.usecase';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly createUserUC: CreateUserUseCase;
  private readonly getUsersUC: GetUsersUseCase;

  constructor(
    private usersRepo: UsersRepository,
    private hashProvider: BcryptHashProvider,
    // private readonly configService: ConfigService,
    // private readonly paginationProvider: PaginationProvider,
  ) {
    this.createUserUC = new CreateUserUseCase(
      this.usersRepo,
      this.hashProvider,
    );
    this.getUsersUC = new GetUsersUseCase(this.usersRepo);
  }

  async getUsers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<UserModel>> {
    return this.getUsersUC.execute(paginationQueryDto);
  }

  createUser(dto: CreateUserModel) {
    return this.createUserUC.execute(dto);
  }

  async deleteUser(id: number) {
    await this.usersRepo.deleteUser(id);
    return { delete: true };
  }

  async FindUserById(id: number) {
    const user = await this.usersRepo.findById(id);
    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'The user with ID ' + id + ' was not found.',
          table: 'user',
        },
        HttpStatus.NOT_FOUND,
        {
          description:
            'The excepion occured because a user with ID ' +
            id +
            ' was not found in users table.',
        },
      );
    }
    return user;
  }
  async findUserByUserName(username: string) {
    let user: UserModel | null = null;
    try {
      user = await this.usersRepo.findByUsername(username);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'User with given username could not be found!',
      });
    }
    if (!user) {
      throw new UnauthorizedException('User does not exist!');
    }
    return user;
  }
}
