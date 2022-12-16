export interface IPaginate<T> {
    previousPage: number | null,
    currentPage: number | null,
    nextPage: number | null,
    totalPages: number | null,
    total: number | null,
    limit: number | null,
    data: T[]
}
