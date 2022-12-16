import { Request } from 'express';
import { NextFunction } from 'connect';
import sequelize from '../sequelize';
import { MyResponse } from '../types/myResponse';
import Middleware from '../types/middleware';
// Wrapper for transaction db
const transactionMiddleware = (middleware: ((req: Request, res: MyResponse, next: NextFunction) => Promise<MyResponse|void>)): Middleware => {
    return async (req: Request, res: MyResponse, next: NextFunction) => {
        try {
            await sequelize.transaction(async () => {
                await middleware(req, res, next);
            });
        } catch (error) {
            next(error);
        }
    };
};
export default transactionMiddleware;
