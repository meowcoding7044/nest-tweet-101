import { User } from '../entities/user.entity';
import { UserModel } from 'src/core/entities/user/user.model';

export const UserMapper = {
  toModel(entity?: User | null): UserModel | null {
    if (!entity) return null;
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      password: entity.password,
      profile: entity.profile ? { bio: entity.profile.bio } : undefined,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  },
};
