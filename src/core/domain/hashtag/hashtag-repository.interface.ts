import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { HashTagModel } from '../../entities/hashtag/hashtag.model';
import { Paginated } from 'src/core/interfaces/pagination.interface';

export interface IHashtagRepository {
  createHashtag(
    createHashtag: Partial<HashTagModel>,
  ): Promise<HashTagModel>;
  findHashtags(hashtags?: number[]): Promise<HashTagModel[] | null>;
  findAllPaginated(
    pagination: PaginationQueryDto,
  ): Promise<Paginated<HashTagModel | null>>;

  deleteHashTag(id: number): Promise<any>;
  softDeleteHashTag(id: number): Promise<any>;
}
