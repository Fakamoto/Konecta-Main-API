import { ClassType } from 'class-transformer/ClassTransformer';
import Params from '../mappers/params';
import { genericValidateParams } from './genericValidateParams';
import Middleware from '../types/middleware';

export const validateBodyParams = (modelClass: ClassType<Params>): Middleware => genericValidateParams(
    (req) => req.body as Params,
    (res, output) => { res.locals.bodyParams = output; },
    modelClass,
);
