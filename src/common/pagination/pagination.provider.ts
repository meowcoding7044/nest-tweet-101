import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  ObjectLiteral,
  Repository,
  FindOptionsWhere,
  FindManyOptions,
} from 'typeorm';
import { Paginated } from './pagination.interface';
import { IPaginationProvider } from 'src/core/interfaces/pagination-provider.interface';

@Injectable()
export class PaginationProvider implements IPaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repository: Repository<T>,
    where?: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<Paginated<T>> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    if (limit <= 0 || page <= 0)
      throw new BadRequestException(
        'Pagination parameters must be positive numbers.',
      );

    const findOptions: FindManyOptions<T> = {
      skip: (page - 1) * limit,
      take: limit,
      relations,
      where,
    };
    const [data, totalItems] = await repository.findAndCount(findOptions);
    const totalPages = Math.max(Math.ceil(totalItems / limit), 1);
    const baseUrl = `${this.request.protocol}://${this.request.headers.host}`;
    const pathname = this.request.path;
    const makeUrl = (p: number) =>
      `${baseUrl}${pathname}?limit=${limit}&page=${p}`;

    return {
      data,
      meta: { itemsPerPage: limit, totalItems, currentPage: page, totalPages },
      links: {
        first: makeUrl(1),
        last: makeUrl(totalPages),
        current: makeUrl(page),
        next: page < totalPages ? makeUrl(page + 1) : null,
        previous: page > 1 ? makeUrl(page - 1) : null,
      },
    };
  }
}
