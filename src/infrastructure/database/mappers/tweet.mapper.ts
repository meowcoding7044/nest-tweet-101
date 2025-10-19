import { TweetModel } from 'src/core/entities/tweet/tweet.model';
import { Tweet } from '../entities/tweet.entity';

export const TweetMapper = {
  toModel(entity?: Tweet | null): TweetModel | null {
    if (!entity) return null;
    return {
      id: entity.id,
      text: entity.text,
      image: entity.image,
      hashtags: entity.hashtags,
      user: entity.user,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};
