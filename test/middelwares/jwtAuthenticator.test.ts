import jwt from 'jsonwebtoken';
import mockRequest from '../mocks/mockRequest';
import mockResponse from '../mocks/mockResponse';
import mockNext from '../mocks/mockNextFunction';
import { validateUserJWT } from '../../api/middlewares';
import config from '../../api/config';
import { TOKEN_ISSUER } from '../../api/services/auth.service';
import { DatabaseError, UnauthorizedError } from '../../api/helpers/errors';
import { User } from '../../api/models/user/user';
import Factory from '../factories/factory';
import resetDB from '../helpers/resetDB';

beforeEach(() => resetDB());

describe('validateUserJWT', () => {
    let req: any;
    let res: any;
    let next: any;
    const run = () => validateUserJWT(req);
    const signToken = (userId: number) => {
        return jwt.sign({ userId }, config.jwtKey, { expiresIn: '1w', issuer: TOKEN_ISSUER, algorithm: 'HS256' });
    };
    let token: string;
    let user: User;

    beforeEach(async () => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext();
        req.get = (string: string) => `Bearer ${token}`;
        user = await Factory.create('User');
        token = signToken(user.id);
    });

    describe('when the token is valid', () => {
        it('should add the user to locals', async () => {
            await run();
            expect(res.locals.loggedUser.id).toEqual(user.id);
        });
    });

    describe('when the token is invalid', () => {
        it('when the token is missing', async () => {
            req.get = () => undefined;
            await run();
            expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
        });

        it('when the token does not have the bearer header', async () => {
            req.get = () => `${signToken(user.id)}`;
            await run();
            expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
        });

        it('when the user no longer exists', async () => {
            await user.destroy();
            await run();
            expect(next.mock.calls[0][0]).toBeInstanceOf(DatabaseError);
            expect(next.mock.calls[0][0].originalError).toBeInstanceOf(UnauthorizedError);
        });

        it('when the token is signed by a random key', async () => {
            token = jwt.sign({ userId: user.id }, 'Random Key', { expiresIn: '1w', issuer: TOKEN_ISSUER, algorithm: 'HS256' });
            await run();
            expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
        });

        it('when the token is expired', async () => {
            token = jwt.sign({ userId: user.id }, 'Random Key', { expiresIn: '1ms', issuer: TOKEN_ISSUER, algorithm: 'HS256' });
            await run();
            await setTimeout(() => {}, 2);
            expect(next.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
        });
    });
});
