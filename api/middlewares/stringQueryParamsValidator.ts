import { ClassType } from 'class-transformer/ClassTransformer';
import Params from '../mappers/params';
import { genericValidateParams } from './genericValidateParams';
import Middleware from '../types/middleware';

export const validateStringQueryParams = (modelClass: ClassType<Params>): Middleware => genericValidateParams(
    (req) => req.query as Params,
    (res, output) => { res.locals.queryParams = output; },
    modelClass,
);
