import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class PaginateService {
  async paginate(
    queryBuilder: SelectQueryBuilder<any>,
    params: any,
  ): Promise<any> {
    const totalCount: number = await queryBuilder.getCount();
    const page: number = params.page || 1;
    const perPage: number = params.perPage || 10;
    const lastPage: number = Math.ceil(totalCount / perPage);

    const skip: number = (page - 1) * perPage;

    queryBuilder.skip(skip).take(perPage);

    return {
      total: totalCount,
      page: page,
      perPage: perPage,
      lastPage: lastPage,
      hasMorePages: page < lastPage,
    };
  }
}
