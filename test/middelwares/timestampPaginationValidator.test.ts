import { BAD_REQUEST } from 'http-status-codes';
import mockRequest from '../mocks/mockRequest';
import mockResponse from '../mocks/mockResponse';
import mockNext from '../mocks/mockNextFunction';
import { validateTimestampPagination } from '../../api/middlewares';
import { BadRequestError } from '../../api/helpers/errors';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../../api/middlewares/timestampPaginationValidator';

describe('validateTimestampPagination', () => {
    let req: any;
    let res: any;
    let next: any;
    const run = () => validateTimestampPagination(req, res, next);

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
    });

    describe('when params missing', () => {
        beforeEach(() => {
            req.query = {};
        });

        test('limit has a default', async () => {
            await run();
            expect(res.locals.timestampPagination.limit).toEqual(DEFAULT_LIMIT);
        });

        test('timestamp does not have a default', async () => {
            await run();
            expect(res.locals.timestampPagination.timestamp).toBeUndefined();
        });
    });

    describe('when params are ok', () => {
        beforeEach(() => {
            req.query = { limit: '10', timestamp: '2020-08-13T23:04:28.464Z' };
        });

        test('limit should be there', async () => {
            await run();
            expect(res.locals.timestampPagination.limit).toEqual(10);
        });

        test('timestamp should be there', async () => {
            await run();
            expect(res.locals.timestampPagination.timestamp).toEqual(new Date('2020-08-13T23:04:28.464Z'));
        });
    });

    describe('when params are not ok', () => {
        beforeEach(() => {
            req.query = { limit: '10', timestamp: '2020-08-13T23:04:28.464Z' };
        });

        test('limit needs to be a number string', async () => {
            req.query.limit = 'Not a number!';
            await run();
            expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        });

        test('limit can not be 0', async () => {
            req.query.limit = '0';
            await run();
            expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
        });

        test('limit can not be more than the maximum', async () => {
            req.query.limit = `${MAX_LIMIT + 1}`;
            await run();
            expect(next.mock.calls[0][0]).toBeInstanceOf(BadRequestError);
        });

        test('the timestamp needs to be a date', async () => {
            req.query.timestamp = 'Not a Date!';
            await run();
            expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        });
    });
});
