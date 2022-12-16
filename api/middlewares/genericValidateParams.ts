import { NextFunction, Request } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { BAD_REQUEST } from 'http-status-codes';
import Params from '../mappers/params';
import { MyResponse } from '../types/myResponse';
import { GenericInternalServerError } from '../helpers/errors';

// TODO change error messages returned by class validator? This could tell how we do validations.
export const genericValidateParams = (inputFunction: (req: Request) => Params,
    outputFunction: (res: MyResponse, output: Params) => void,
    modelClass: ClassType<Params>) => function internalValidateParams(
    req: Request, res: MyResponse, next: NextFunction,
): Promise<void> {
    const output: Params = plainToClass(modelClass, inputFunction(req), { excludeExtraneousValues: true });
    return validate(output, { skipMissingProperties: false }).then(
        (errors) => {
            // errors is an array of validation errors
            if (errors.length > 0) {
                const errorTexts: {[type: string]: string}[] = [];
                errors.forEach((error) => {
                    if (error.constraints != null) {
                        errorTexts.push(error.constraints);
                    } else {
                        errorTexts.push({ 'error:': 'Unknown validation error' });
                    }
                });
                res.status(BAD_REQUEST).send(errorTexts); // TODO use error middleware
            } else {
                try {
                    outputFunction(res, output);
                } catch (error) {
                    next(error);
                }
                next();
            }
        },
        (error) => {
            next(new GenericInternalServerError('Unknown error validating parameters', error));
        },
    );
};
