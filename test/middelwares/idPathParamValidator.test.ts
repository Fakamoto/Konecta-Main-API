import mockRequest from '../mocks/mockRequest';
import mockResponse from '../mocks/mockResponse';
import mockNext from '../mocks/mockNextFunction';
import { validateBodyParams, validateIdPathParam } from '../../api/middlewares';
import { BadRequestError } from '../../api/helpers/errors';

describe('validateBodyParams', () => {
    let req: any;
    let res: any;
    let next: any;
    const run = () => validateIdPathParam(req, res, next);

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
    });

    describe('when param is number', () => {
        test('should be there', async () => {
            req.params = { id: 2 };
            await run();
            expect(res.locals.id).toEqual(2);
        });
    });

    describe('when param is not a number', () => {
        test('should throw error', async () => {
            req.params = { id: 'Not a number!' };
            expect(run).toThrow(BadRequestError);
        });
    });
});
