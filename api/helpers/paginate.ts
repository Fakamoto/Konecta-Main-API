/* eslint-disable */
import { IPaginate } from "api/types/paginate";
import { DatabaseError } from "./errors";

type Options = {
  model: any, // TODO: buscar type correcto
  page?: string,
  limit?: string,
  query: any,
  scope: string[],
  transform?: Function
}

const getOffset = (page: number, limit: number): number => ((page * limit) - limit);

const getNextPage = (page: number, limit: number, total: number): number | null => {
  if ((total / limit) > page) return page + 1;
  return null
}

const getPreviousPage = (page: number): number | null => ((page <= 1) ? null : page - 1);

export const Paginate = async <T>(options: Options): Promise<IPaginate<T>> => {
  const { model, page: pageNumber = '1', limit: size = '10', query, transform, scope = [] } = options;

  const limit = parseInt(size, 10) || 10;
  const page = parseInt(pageNumber, 10) || 1;

  let paginate = {
    offset: getOffset(page, limit),
    limit: limit,
  };

  let search;

  if (Object.keys(query).length) {
    search = { ...paginate, ...query };
  }

  let { count, rows } = await model.scope(scope).findAndCountAll(search)
    .catch((error: Error) => {
      throw new DatabaseError(error);
    });

  if (transform && typeof transform === 'function') {
    rows = transform(rows);
  }

  return {
    previousPage: getPreviousPage(page),
    currentPage: page,
    nextPage: getNextPage(page, limit, count),
    totalPages: Math.ceil(count / limit),
    total: count,
    limit: limit,
    data: rows
  }
};
