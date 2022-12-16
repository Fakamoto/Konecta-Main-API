import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import express, { Router } from 'express';
import { Express, NextFunction, Request, Response, } from 'express-serve-static-core';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { ValidationError } from 'sequelize';
import GenericError from './helpers/errors/genericError';
import { BadRequestError, DatabaseError } from './helpers/errors';
import { Logger } from './logger';

const LoggerInstance = new Logger('Express');

const expressApp = (rootRouter: Router): Express => {
    const app: Express = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (process.env.NODE_ENV === 'development') {
        // Morgan is used to log request. https://stackoverflow.com/questions/23494956/how-to-use-morgan-logger
        app.use(morgan('dev'));
    }

    // Helmet helps you secure your Express apps by setting various HTTP headers.
    app.use(helmet());

    // Enable cors for all routes, this is because all endpoints are open to public (with auth). If we ever add
    // private internal endpoints this needs to be changed.
    app.use(cors());

    // Change `undefined` values to `null` in json because json will remove them as they are not json compliant.
    //  We do this in case we serialize something undefined, but actually it is better to never actually serialize
    //  something that is undefined. This is just in case, but always use "| null" in serializers instead of
    //  allowing undefined values for the DTOs.
    app.set('json replacer', (key: string, value: unknown): unknown => {
        if (typeof value === 'undefined') { return null; }
        return value;
    });

    // Add APIs
    app.use('/api', rootRouter);

    // Default (ie. catch-all) route: 404 not found
    app.use((req: Request, res: Response) => {
        res.status(404).send({ url: `${req.originalUrl} not found` });
    });

    // Database errors handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        if (err instanceof DatabaseError && err.originalError != null) {
            if (err.originalError instanceof GenericError) return next(err.originalError);
            if (err.originalError.name === 'SequelizeValidationError') {
                const sequelizeValidationError = err.originalError as ValidationError;
                // TODO change this to not skip next error handlers
                // TODO this is also handling all model errors as user input errors
                const errors: string[] = [];
                sequelizeValidationError.errors.forEach((error) => {
                    errors.push(`${error.path}: ${error.message}`);
                });

                LoggerInstance.error(`[${errors.join(', ')}]`);
                res.status(BAD_REQUEST).json({ errors });
                return;
            }
        }
        return next(err);
    });

    // JSON parse error
    app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        if (err instanceof SyntaxError) {
            next(new BadRequestError('Syntax error', undefined, err));
        } else {
            next(err);
        }
    });

    // Expected errors handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        if (err instanceof GenericError) {
            if (err.originalError != null) {
                LoggerInstance.error(err.originalError);
                LoggerInstance.error(err.originalError.message);
            }
            if (err.logMessage != null) {
                LoggerInstance.error(err.logMessage);
            }
            if (err.frontendMessage != null) {
                LoggerInstance.error(`Frontend message: ${err.frontendMessage}`);
            }

            res.status(err.code).json({ error: err.message, errorCode: err.errorCode });
        } else {
            next(err);
        }
    });

    // Default error handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
        LoggerInstance.error(err.message);
        LoggerInstance.error(err);
        res.status(INTERNAL_SERVER_ERROR).json({
            error: 'Unknown internal error',
        });
    });

    return app;
};

export default expressApp;
