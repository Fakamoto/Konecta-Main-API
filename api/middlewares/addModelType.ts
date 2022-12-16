import { NextFunction, Request } from 'express';
import { MyResponse } from '../types/myResponse';

export const addModelType = (modelType: string) => function internalValidateParams(
    req: Request, res: MyResponse, next: NextFunction,
): void {
    res.locals.modelType = modelType;
    next();
};
