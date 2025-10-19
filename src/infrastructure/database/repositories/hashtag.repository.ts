import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHashtagModel } from 'src/core/entities/hashtag/create-hashtag.model';
import { HashTagModel } from 'src/core/entities/hashtag/hashtag.model';
import { IHashtagRepository } from 'src/core/domain/hashtag/hashtag-repository.interface';
import { Hashtag } from '../entities/hashtag.entity';
import { In, Repository } from 'typeorm';
import { PaginationProvider } from 'src/infrastructure/providers/pagination/pagination.provider';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { HashMapper } from '../mappers/hashtag.mapper';

@Injectable()
export class HashtagRepository implements IHashtagRepository {
  
  constructor(
    @InjectRepository(Hashtag)
    private readonly repo: Repository<Hashtag>,
    private readonly pagination: PaginationProvider,
  ) {}

  async createHashtag(
    createHashtag: CreateHashtagModel,
  ): Promise<HashTagModel> {
    const entity = this.repo.create(createHashtag);
    const saved = await this.repo.save(entity);
    return saved;
  }
  async findHashtags(hashtags?: number[]): Promise<HashTagModel[] | null> {
    if (!hashtags) return null;
    const e = await this.repo.find({
      where: { id: In(hashtags) },
    });
    return e ? e : null;
  }
  async deleteHashTag(id: number): Promise<any> {
    return await this.repo.delete(id);
  }
  async softDeleteHashTag(id: number): Promise<any> {
    return await this.repo.softDelete(id);
  }
  async findAllPaginated(
    paginationDto: PaginationQueryDto,
  ): Promise<Paginated<HashTagModel | null>> {
    const paged = await this.pagination.paginateQuery(
      paginationDto,
      this.repo,
      {},
    );

    return {
      ...paged,
      data: paged.data.map((e: any) => HashMapper.toModel(e as Hashtag)!),
    };
  }
}
