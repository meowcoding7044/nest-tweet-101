import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { IUsersRepository } from 'src/core/domain/user/users-repository.interface';
import { UserModel } from 'src/core/entities/user/user.model';
import { PaginationProvider } from 'src/infrastructure/providers/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly pagination: PaginationProvider,
  ) {}


  async findById(id: number): Promise<UserModel | null> {
    const e = await this.repo.findOne({
      where: { id },
      relations: ['profile'],
    });
    return e ? UserMapper.toModel(e) : null;
  }
  async findByUsername(username: string): Promise<UserModel | null> {
    const e = await this.repo.findOne({ where: { username } });
    return e ? UserMapper.toModel(e) : null;
  }
  async findByEmail(email: string): Promise<UserModel | null> {
    const e = await this.repo.findOne({ where: { email } });
    return e ? UserMapper.toModel(e) : null;
  }

  async createUser(user: Partial<UserModel>): Promise<UserModel> {
    const entity = this.repo.create(user as unknown as User);
    const saved = await this.repo.save(entity);
    return UserMapper.toModel(saved)!;
  }

  async deleteUser(id: number): Promise<{ deleted: boolean }> {
    const res = await this.repo.delete(id);
    return { deleted: (res.affected || 0) > 0 };
  }
  async findAllPaginated(
    paginationDto: PaginationQueryDto,
  ): Promise<Paginated<UserModel | null>> {
    const paged = await this.pagination.paginateQuery(
      paginationDto,
      this.repo,
      {},
      ['profile'],
    );
    return {
      ...paged,
      data: paged.data.map((e: any) => UserMapper.toModel(e as User)!),
    };
  }
}
