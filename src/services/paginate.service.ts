import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  NestedObject,
  PaginationParams,
  PaginationProps,
} from '../types/Options';
import { getNestedFields } from '../utils/object';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class PaginateService<T> {
  async paginate(
    repository: Repository<T>,
    queries: NestedObject,
    paginationParams: PaginationProps,
  ): Promise<PaginationParams<T>> {
    const totalCount: number = await repository.count();
    const page: number = paginationParams.page || 1;
    const perPage: number = paginationParams.perPage || 10;
    const lastPage: number = Math.ceil(totalCount / perPage);
    const skip: number = (page - 1) * perPage;

    const { pageInfo: paginationQueries, edges: edgesQueries } = queries;

    const nestedObjects = getNestedFields(edgesQueries);

    const edges = await repository.find({
      select: edgesQueries,
      relations: nestedObjects as FindOptionsRelations<T>,
      skip: skip,
      take: perPage,
    });

    const paginationProps = {
      total: totalCount,
      page: page,
      perPage: perPage,
      lastPage: lastPage,
      hasMorePages: page < lastPage,
    };

    const paginationKeys = Object.keys(paginationQueries);
    const pageInfo = Object.entries(paginationProps).reduce(
      (prev, [key, value]) =>
        paginationKeys.includes(key) ? { ...prev, [key]: value } : prev,
      {},
    );

    return {
      edges,
      pageInfo,
    };
  }
}
