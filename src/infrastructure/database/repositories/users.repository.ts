import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUsersRepository } from 'src/core/interfaces/users-repository.interface';
import { UserModel } from 'src/core/entities/user.model';
import { PaginationProvider } from 'src/common/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/pagination/dto/pagination-query.dto';
import { Paginated } from 'src/common/pagination/pagination.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  private toModel(entity: UserEntity): UserModel {
    if (!entity) return null as any;
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      password: entity.password,
      profile: entity.profile ? { bio: entity.profile.bio } : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  async findById(id: number): Promise<UserModel | null> {
    const e = await this.repo.findOne({ where: { id } });
    return e ? this.toModel(e) : null;
  }

  async findByUsername(username: string): Promise<UserModel | null> {
    const e = await this.repo.findOne({ where: { username } });
    return e ? this.toModel(e) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const e = await this.repo.findOne({ where: { email } });
    return e ? this.toModel(e) : null;
  }

  async createUser(user: Partial<UserModel>): Promise<UserModel> {
    const entity = this.repo.create(user as UserEntity);
    const saved = await this.repo.save(entity);
    return this.toModel(saved);
  }
  async deleteUser(id: number): Promise<any> {
    return await this.repo.delete(id);
  }

  async findAllPaginated(
    pagination: PaginationQueryDto,
  ): Promise<Paginated<UserModel>> {
    const result = await this.paginationProvider.paginateQuery(
      pagination,
      this.repo,
      {},
      ['profile'],
    );
    return {
      ...result,
      data: result.data.map((entity) => this.toDomain(entity)),
    };
  }

   private toDomain(entity: UserEntity): UserModel {
    const { id, username, email, password, profile } = entity;
    return { id, username, email, password, profile };
  }
}
