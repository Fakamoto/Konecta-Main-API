import { Serializer } from '../serializer';
import { IPaginate } from 'api/types/paginate';


export class PaginatorSerializer<T> extends Serializer<IPaginate<T>, PaginatorDTO<T>> {
    constructor(
        private serializer: Serializer<any, any>
    ) {
        super();
    }

    serialize<T>(paginator: IPaginate<T>): PaginatorDTO<T> {
        return {
            previousPage: paginator.previousPage,
            currentPage: paginator.currentPage,
            totalPages: paginator.totalPages,
            nextPage: paginator.nextPage,
            total: paginator.total,
            limit: paginator.limit,
            data: this.serializer.serializeList(paginator.data)
        };
    }
}

export interface PaginatorDTO<T> {
    previousPage: number | null,
    currentPage: number | null,
    nextPage: number | null,
    totalPages: number | null,
    total: number | null,
    limit: number | null,
    data: T[]
}
