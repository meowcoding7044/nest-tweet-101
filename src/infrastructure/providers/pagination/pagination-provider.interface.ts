import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { Paginated } from 'src/core/interfaces/pagination.interface';
import { ObjectLiteral, Repository } from 'typeorm';

export interface IPaginationProvider {
  paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: any,
    relations?: string[]
  ): Promise<Paginated<T>>;
}
