import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from '../../infrastructure/database/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { Profile } from 'src/infrastructure/database/entities/profile.entity';
import { ConfigService } from '@nestjs/config';
import { table } from 'console';
import { UserAlreadyExistsException } from 'src/common/customExceptions/user-already-exists.excepion';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { HashingProvider } from 'src/modules/auth/provider/hashing.provider';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private readonly configService: ConfigService,
    private readonly paginationProvider: PaginationProvider,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async getUsers(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<User>> {
    const environment = this.configService.get<string>('ENV_MODE');
    this.logger.debug(`Environment mode: ${environment}`);
    try {
      return await this.paginationProvider.paginateQuery(
        paginationQueryDto,
        this.userRepository,
        {},
        ['profile'],
      );
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED') {
        this.logger.error('Database connection failed', err.stack);
        throw new RequestTimeoutException(
          'An error has occured. please try again later.',
          {
            description: 'Could not connect to database.',
          },
        );
      }
      this.logger.error('Unexpected error in getUsers()', err.stack);
      throw new InternalServerErrorException(
        'Unexpected server error occurred.',
      );
    }
  }

  async createUser(userDto: CreateUserDto) {
    try {
      userDto.profile = userDto.profile ?? {};
      const existingUserWithUsername = await this.userRepository.findOne({
        where: { username: userDto.username },
      });
      if (existingUserWithUsername) {
        throw new UserAlreadyExistsException('username', userDto.username);
      }
      const existingUserWithEmail = await this.userRepository.findOne({
        where: { email: userDto.email },
      });
      if (existingUserWithEmail) {
        throw new UserAlreadyExistsException('email', userDto.email);
      }
      let user = this.userRepository.create({
        ...userDto,
        password: await this.hashingProvider.hashPassword(userDto.password),
      });

      //set the profile
      //user.profile = profile;

      //save the user object
      return await this.userRepository.save(user);
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        throw new RequestTimeoutException(
          'An error has occured. please try again later.',
          {
            description: 'Could not connect to database.',
          },
        );
      }
      throw err;
      // if (err.code === '23505') {
      //   throw new BadRequestException(
      //     'There is some dulicate value for the user in Database.',
      //   );
      // }
    }
  }

  async deleteUser(id: number) {
    await this.userRepository.delete(id);

    return { delete: true };
  }

  async FindUserById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
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
    let user: User | null = null;

    try {
      user = await this.userRepository.findOneBy({
        username: username,
      });
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
