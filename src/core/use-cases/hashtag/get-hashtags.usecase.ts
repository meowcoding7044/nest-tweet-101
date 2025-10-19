import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { IHashtagRepository } from 'src/core/domain/hashtag/hashtag-repository.interface';
import { HashTagModel } from 'src/core/entities/hashtag/hashtag.model';
import { Paginated } from 'src/core/interfaces/pagination.interface';

export class GetHashtagsUseCase {
  constructor(private readonly hashtagRepo: IHashtagRepository) {}

  async execute(
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<HashTagModel | null>> {
    try {
      return await this.hashtagRepo.findAllPaginated(paginationQueryDto);
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED') {
        throw new Error('An error has occurred. Please try again later.');
      }
      throw new Error('Unexpected server error occurred.');
    }
  }
}
