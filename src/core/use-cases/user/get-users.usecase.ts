import type { IUsersRepository } from '../../domain/user/users-repository.interface';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { UserModel } from 'src/core/entities/user/user.model';

export class GetUsersUseCase {
  constructor(private readonly usersRepo: IUsersRepository) {}

  async execute(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<UserModel | null>> {
    try {
      return await this.usersRepo.findAllPaginated(paginationQueryDto);
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED') {
        throw new Error('An error has occurred. Please try again later.');
      }
      throw new Error('Unexpected server error occurred.');
    }
  }
}
