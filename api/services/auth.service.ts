import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/user/user';
import { ErrorMessages, GenericInternalServerError, UnauthorizedError, } from '../helpers/errors';
import JwtToken from '../types/jwtToken';
import config from '../config';
import { LoginParams } from '../mappers';
import LoginResults from '../types/loginResults';
import { TwoFAService } from './2fa.service';

export const TOKEN_ISSUER = 'Clapps';

export class AuthService {

    constructor(private twoFAService: TwoFAService) {
    }

    private buildToken = (userId: number) => {
        const token: JwtToken = { id: userId };
        return jwt.sign(token, config.jwtKey, { expiresIn: '1y', issuer: TOKEN_ISSUER, algorithm: 'HS256' });
    };

    tokenLogin = async (loggedUser: User): Promise<LoginResults> => {
        return Promise.resolve({ user: loggedUser, jwt: this.buildToken(loggedUser.id) });
    };

    login = async (loginParams: LoginParams): Promise<LoginResults> => {
        const users = await User.findAll({
            where: {
                email: loginParams.email.trim().toLowerCase(),
            }
        });

        if (users.length === 0) throw new UnauthorizedError(ErrorMessages.invalidCredentials);
        const user = users[0];

        const secret = user.secret2FA;
        if (secret) {
            const valid = this.twoFAService.verifyToken(loginParams.otp, secret);
            if (!valid) {
                throw new UnauthorizedError(
                    ErrorMessages.invalidCredentials, undefined,
                    undefined,
                    'OTP do not match'
                );
            }
        }

        const isPasswordValid = await bcrypt.compare(loginParams.password, user.password)
            .catch((error: any) => { throw new GenericInternalServerError(undefined, error); });

        if (!isPasswordValid) {
            throw new UnauthorizedError(ErrorMessages.invalidCredentials, undefined,
                undefined, 'Passwords do not match');
        }

        const signedToken = this.buildToken(user.id);
        return { user, jwt: signedToken };
    };

    refresh = (loggedUser: User): Promise<string> => {
        return Promise.resolve(this.buildToken(loggedUser.id));
    };

    public generateCode = (): string => {
        const defaultCode = process.env.DEFAULT_OTP;
        return (defaultCode || Math.floor(Math.random() * 999999))
            .toLocaleString('en-US', { minimumIntegerDigits: 6 })
            .replace(',', '');
    }
}
