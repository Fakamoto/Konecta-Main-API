import { NextFunction, Request } from 'express';
import { MyResponse } from '../types/myResponse';
import { isNumber } from '../helpers/util';
import { BadRequestError } from '../helpers/errors';

export const validateIdPathParam = (req: Request, res: MyResponse, next: NextFunction): void => {
    const { id } = req.params;
    if (!isNumber(id)) {
        throw new BadRequestError('Invalid id format');
    }
    res.locals.id = Number(id);
    next();
};
