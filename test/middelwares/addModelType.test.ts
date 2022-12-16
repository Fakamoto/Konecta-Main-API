import mockRequest from '../mocks/mockRequest';
import mockResponse from '../mocks/mockResponse';
import mockNext from '../mocks/mockNextFunction';
import { addModelType } from '../../api/middlewares';

describe('addModelType', () => {
    const modelType = 'Model type!!';
    let req: any;
    let res: any;
    let next: any;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
        addModelType(modelType)(req, res, next);
    });

    test('should add the model type', () => {
        expect(res.locals.modelType).toEqual(modelType);
    });
});
