import { Inject, Injectable } from '@nestjs/common';
import { CreateHashtagDto } from './dtos/create-hashtag.dto';
import { CreateHashtagUseCase } from 'src/core/use-cases/hashtag/create-hashtag.usercase';
import { HashtagRepository } from 'src/infrastructure/database/repositories/hashtag.repository';
import { HASHTAG_REPOSITORY } from 'src/common/constants/tokens';
import type { IHashtagRepository } from 'src/core/domain/hashtag/hashtag-repository.interface';
import { GetHashtagsUseCase } from 'src/core/use-cases/hashtag/get-hashtags.usecase';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { HashTagModel } from 'src/core/entities/hashtag/hashtag.model';

@Injectable()
export class HashtagService {
  constructor(
    private readonly createHashtagUC: CreateHashtagUseCase,
    private readonly getHashtagsUC: GetHashtagsUseCase,
    @Inject(HASHTAG_REPOSITORY)
    private readonly hashtagRepo: IHashtagRepository,
  ) {}

  async createHashtag(createHashtagDto: CreateHashtagDto) {
    return this.createHashtagUC.execute(createHashtagDto);
  }

  async getHashtags(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<HashTagModel | null>> {
    return this.getHashtagsUC.execute(paginationQueryDto);
  }
  async findHashtags(hashtags?: number[]) {
    if (!hashtags) return;
    return await this.hashtagRepo.findHashtags(hashtags);
  }

  async deleteHashTag(id: number) {
    await this.hashtagRepo.deleteHashTag(id);
    return { delete: true, id };
  }

  async softDeleteHashTag(id: number) {
    await this.hashtagRepo.softDeleteHashTag(id);
    return { delete: true, id };
  }
}
