export interface TimestampPagination {
    timestamp?: Date,
    limit: number,
}

export default interface ListOptions {
    userId?: number,
    pagination: TimestampPagination,
}
