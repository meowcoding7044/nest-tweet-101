import { UserModel } from '../../entities/user/user.model';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';

export interface IUsersRepository {
  findById(id: number): Promise<UserModel | null>;
  findByUsername(username: string): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  createUser(user: Partial<UserModel>): Promise<UserModel>;
  deleteUser(id: number): Promise<{ deleted: boolean }>;
  findAllPaginated(
    pagination: PaginationQueryDto,
  ): Promise<Paginated<UserModel | null>>;
}
