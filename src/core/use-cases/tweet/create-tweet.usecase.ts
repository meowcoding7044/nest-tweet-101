import type { ITweetRepository } from '../../domain/tweet/tweet-repository.interface';
import type { TweetModel } from 'src/core/entities/tweet/tweet.model';
import type { IUsersRepository } from 'src/core/domain/user/users-repository.interface';
import type { IHashtagRepository } from 'src/core/domain/hashtag/hashtag-repository.interface';
import { CreateTweetModel } from 'src/core/entities/tweet/create-tweet.model';

export class CreateTweetUseCase {
  constructor(
    private tweetRepo: ITweetRepository,
    private usersRepo: IUsersRepository,
    private hashTagRepo: IHashtagRepository,
  ) {}

  async execute(
    userId: number,
    payload: Partial<CreateTweetModel>,
  ): Promise<TweetModel | null> {
    if (!payload.text || !userId) {
      throw new Error('Missing required fields');
    }

    let hashtags: any = undefined;
    let user = await this.usersRepo.findById(userId);
    if (!user) throw new Error('User userId not found!');

    if (payload?.hashtags) {
      hashtags = await this.hashTagRepo.findHashtags(payload.hashtags);
    }

    if (payload.hashtags?.length !== hashtags?.length) {
      throw new Error();
    }
    const created = await this.tweetRepo.createTweet(payload, user, hashtags);
    return created;
  }
}
