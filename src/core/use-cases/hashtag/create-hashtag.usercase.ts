import { IHashtagRepository } from 'src/core/domain/hashtag/hashtag-repository.interface';
import { CreateHashtagModel } from 'src/core/entities/hashtag/create-hashtag.model';
import { HashTagModel } from 'src/core/entities/hashtag/hashtag.model';


export class CreateHashtagUseCase {
  constructor(private hashtagRepo: IHashtagRepository) {}

  async execute(payload: Partial<CreateHashtagModel>): Promise<HashTagModel> {
    if (!payload.name) {
      throw new Error('Missing required fields');
    }
    let created = await this.hashtagRepo.createHashtag(payload);
    return created;
  }
}
