import { genericValidateParams } from './genericValidateParams';
import { TimestampPaginationParams } from '../mappers';
import { BadRequestError } from '../helpers/errors';

export const MAX_LIMIT = 100;
export const DEFAULT_LIMIT = 20;

export const validateTimestampPagination = genericValidateParams((req) => req.query,
    (res, output: any) => {
        res.locals.timestampPagination = { limit: DEFAULT_LIMIT };
        const { limit } = output;
        if (limit != null) {
            const newLimit = Number(output.limit);
            if (newLimit <= 0 || newLimit > MAX_LIMIT) {
                throw new BadRequestError(`The limit must be an integer between 1 and ${MAX_LIMIT}`);
            }
            res.locals.timestampPagination.limit = newLimit;
        }
        if (output.timestamp) res.locals.timestampPagination.timestamp = new Date(output.timestamp);
    },
    TimestampPaginationParams);
