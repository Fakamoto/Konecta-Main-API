import { NextFunction, Request } from 'express-serve-static-core';
import { MyResponse } from '../types/myResponse';
import { JwtService } from '../services';

export const validateUserJWT = (jwtService: JwtService) => async (req: Request, res: MyResponse, next: NextFunction): Promise<void> => {
    try {
        const token: string = jwtService.getToken(req.get('authorization'));
        res.locals.loggedUser = await jwtService.getUserFromTokenString(token);
        next();
    } catch (error) {
        next(error);
    }
};
