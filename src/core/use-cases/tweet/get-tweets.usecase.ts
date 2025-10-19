import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { TweetModel } from 'src/core/entities/tweet/tweet.model';
import { ITweetRepository } from 'src/core/domain/tweet/tweet-repository.interface';

export class GetTweetsUseCase {
  constructor(private tweetRepo: ITweetRepository) {}
  async execute(
    userId: number,
    paginationQueryDto: PaginationQueryDto,
  ): Promise<Paginated<TweetModel | null>> {
    try {
      return await this.tweetRepo.findAllPaginated(userId, paginationQueryDto);
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED') {
        throw new Error('An error has occurred. Please try again later.');
      }
      throw new Error('Unexpected server error occurred.');
    }
  }
}
