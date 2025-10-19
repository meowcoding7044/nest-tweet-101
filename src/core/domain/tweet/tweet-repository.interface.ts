import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { TweetModel } from '../../entities/tweet/tweet.model';
import { CreateTweetModel } from 'src/core/entities/tweet/create-tweet.model';
import { UserModel } from 'src/core/entities/user/user.model';
import { HashTagModel } from 'src/core/entities/hashtag/hashtag.model';

export interface ITweetRepository {
  createTweet(
    createTweetModel: Partial<CreateTweetModel>,
    user: UserModel,
    hashtags: HashTagModel[],
  ): Promise<TweetModel | null>;
  findAllPaginated(
    userId: number,
    pagination: PaginationQueryDto,
  ): Promise<Paginated<TweetModel | null>>;
  //   getTweets(
  //     userId: number,
  //     pageQueryDto: PaginationQueryDto,
  //   ): Promise<Paginated<TweetModel>>;
  deleteTweet(id: number): Promise<any>;
}
