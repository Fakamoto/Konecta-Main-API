import { IsArray, IsDefined, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { BAD_REQUEST } from 'http-status-codes';
import mockRequest from '../mocks/mockRequest';
import mockResponse from '../mocks/mockResponse';
import mockNext from '../mocks/mockNextFunction';
import { validateBodyParams } from '../../api/middlewares';
import Params from '../../api/mappers/params';

class TestBodyParamsClass extends Params {
    @IsDefined()
    @Expose()
    mandatoryField!: string;

    @Expose()
    optionalField?: string;

    @IsString()
    @Expose()
    stringField?: string;

    @IsNumber()
    @Expose()
    numberField?: number;

    @IsArray()
    @IsString({ each: true })
    @Expose()
    stringArray?: Array<string>;
}

describe('validateBodyParams', () => {
    let req: any;
    let res: any;
    let next: any;
    let testParams: any;
    const run = () => validateBodyParams(TestBodyParamsClass)(req, res, next);

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
        testParams = {
            mandatoryField: 'Always here',
            optionalField: 'Can be here',
            stringField: 'Just a string',
            numberField: 10,
            stringArray: ['First', 'Second'],
        };
        req.body = testParams;
    });

    describe('when params are ok', () => {
        test('all params should be there', async () => {
            await run();
            expect(res.status).toHaveBeenCalledTimes(0);
            expect(res.locals.bodyParams.mandatoryField).toEqual(testParams.mandatoryField);
            expect(res.locals.bodyParams.optionalField).toEqual(testParams.optionalField);
            expect(res.locals.bodyParams.stringField).toEqual(testParams.stringField);
            expect(res.locals.bodyParams.numberField).toEqual(testParams.numberField);
            expect(res.locals.bodyParams.stringArray).toEqual(testParams.stringArray);
        });

        test('optional field can be missing', async () => {
            testParams.optionalField = null;
            await run();
            expect(res.locals.bodyParams.optionalField).toBeNull();
            expect(res.status).toHaveBeenCalledTimes(0);
        });

        test('extra params are filtered', async () => {
            testParams.newField = 'This field is not expected!';
            await run();
            expect(res.locals.bodyParams.newField).toBeUndefined();
        });
    });

    describe('when params are not ok', () => {
        test('mandatory field need to be there', async () => {
            testParams.mandatoryField = null;
            await run();
            expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        });

        test('string field need to be string', async () => {
            testParams.stringField = 0;
            await run();
            expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        });

        test('number field need to be number', async () => {
            testParams.numberField = 'Not a number!';
            await run();
            expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        });

        test('array field needs to be an array', async () => {
            testParams.stringArray = 'Not an array!';
            await run();
            expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        });

        test('string array field need to have all values be strings', async () => {
            testParams.stringArray = ['this is a string', 10];
            await run();
            expect(res.status).toHaveBeenCalledWith(BAD_REQUEST);
        });
    });
});
