import { Injectable } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { TweetModel } from 'src/core/entities/tweet/tweet.model';
import { ITweetRepository } from 'src/core/domain/tweet/tweet-repository.interface';
import { Tweet } from '../entities/tweet.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PaginationProvider } from 'src/infrastructure/providers/pagination/pagination.provider';
import { TweetMapper } from '../mappers/tweet.mapper';
import { CreateTweetModel } from 'src/core/entities/tweet/create-tweet.model';
import { HashTagModel } from 'src/core/entities/hashtag/hashtag.model';
import { UserModel } from 'src/core/entities/user/user.model';

@Injectable()
export class TweetRepository implements ITweetRepository {
  constructor(
    @InjectRepository(Tweet)
    private readonly repoTweet: Repository<Tweet>,
    private readonly paginationProvider: PaginationProvider,
  ) {}
  async findAllPaginated(
    userId: number,
    pagination: PaginationQueryDto,
  ): Promise<Paginated<TweetModel>> {
    const result = await this.paginationProvider.paginateQuery(
      pagination,
      this.repoTweet,
      { user: { id: userId } },
    );
    return {
      ...result,
      data: result.data.map((e: any) => TweetMapper.toModel(e as Tweet)!),
    };
  }

  async createTweet(
    createTweetModel: Partial<CreateTweetModel>,
    user: UserModel,
    hashtags:HashTagModel[]
  ): Promise<TweetModel | null> {
    const entity = this.repoTweet.create({
      ...createTweetModel,
      user,
      hashtags,
    })
    const saved = await this.repoTweet.save(entity);
    return TweetMapper.toModel(saved);
  }
  async deleteTweet(id: number): Promise<any> {
    const res = await this.repoTweet.delete(id);
    return { deleted: (res.affected || 0) > 0 };
  }
}
