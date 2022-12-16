import jwt from 'jsonwebtoken';
import { DatabaseError, ErrorMessages, UnauthorizedError } from '../helpers/errors';
import JwtToken from '../types/jwtToken';
import config from '../config';
import { TOKEN_ISSUER } from './auth.service';
import { User } from '../models/user/user';

const JWT_KEY = process.env.JWT_KEY || '';

export class JwtService {

    // MERCADO PAGO
    public sign = (data: any) => jwt.sign(JSON.stringify(data), JWT_KEY);
    public verify = (token: string) => jwt.verify(token, JWT_KEY);
    public decode = (token: string) => jwt.decode(token);

    public getToken = (tokenHeader: string | undefined): string => {
        if (tokenHeader == null || !/^Bearer .+/.test(tokenHeader)) {
            throw new UnauthorizedError(ErrorMessages.noCredentials);
        }
        return tokenHeader.split('Bearer ')[1];
    };

    private getDecodedToken = (token: string): JwtToken => {
        try {
            return jwt.verify(token, config.jwtKey,
                { algorithms: [ 'HS256' ], issuer: TOKEN_ISSUER }) as JwtToken;
        } catch (error) { throw new UnauthorizedError(ErrorMessages.invalidCredentials, error as Error); }
    };

    private getPlainUserFromToken = (decodedUserToken: JwtToken): Promise<User> => {
        return User.findByPk(decodedUserToken.id).then((user: User|null) => {
            if (user == null) throw new UnauthorizedError(ErrorMessages.invalidCredentials);
            return user;
        }).catch((error: any) => { throw new DatabaseError(error); });
    };

    getUserFromTokenString = async (token?: string): Promise<User> => {
        if (token == null) throw new UnauthorizedError();
        const decodedUserToken: JwtToken = this.getDecodedToken(token);
        const user = await this.getPlainUserFromToken(decodedUserToken);
        if (!user) {
            throw new UnauthorizedError();
        }
        return user;
    };
}
