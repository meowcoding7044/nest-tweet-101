import { HashTagModel } from 'src/core/entities/hashtag/hashtag.model';
import { Hashtag } from '../entities/hashtag.entity';
import { User } from '../entities/user.entity';
import { UserModel } from 'src/core/entities/user/user.model';

export const HashMapper = {
  toModel(entity?: Hashtag | null): HashTagModel | null {
    if (!entity) return null;
    return {
      id: entity.id,
      name: entity.name,
    };
  },
};
