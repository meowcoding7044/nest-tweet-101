import { IUsersRepository } from '../interfaces/users-repository.interface';
import { Paginated } from 'src/common/pagination/pagination.interface';
import { UserModel } from '../entities/user.model';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import {
  InternalServerErrorException,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';

export class GetUsersUseCase {
  private readonly logger = new Logger(GetUsersUseCase.name);

  constructor(private readonly usersRepo: IUsersRepository) {}

  async execute(paginationQueryDto: PaginationQueryDto): Promise<Paginated<UserModel>> {
    try {
      return await this.usersRepo.findAllPaginated(paginationQueryDto);
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED') {
        this.logger.error('Database connection failed', err.stack);
        throw new RequestTimeoutException(
          'An error has occurred. Please try again later.',
          { description: 'Could not connect to database.' },
        );
      }
      this.logger.error('Unexpected error in GetUsersUseCase', err.stack);
      throw new InternalServerErrorException('Unexpected server error occurred.');
    }
  }
}
