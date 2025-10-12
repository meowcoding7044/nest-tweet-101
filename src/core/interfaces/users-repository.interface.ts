import { UserModel } from '../entities/user.model';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/pagination.interface';

export interface IUsersRepository {
  findById(id: number): Promise<UserModel | null>;
  findByUsername(username: string): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  createUser(user: Partial<UserModel>): Promise<UserModel>;
  deleteUser(id: number): Promise<any>;
  findAllPaginated(
    pagination: PaginationQueryDto,
  ): Promise<Paginated<UserModel>>;
}
