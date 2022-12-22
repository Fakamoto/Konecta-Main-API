import { BAD_REQUEST } from 'http-status-codes';
import GenericError from './genericError';
import {BadRequestError} from './badRequestError';

export class LimitRequestError extends GenericError {
    static DEFAULT_MESSAGE = 'Limit Exceeded';
    static STATUS_CODE = BAD_REQUEST;

    constructor(message?: string, errorCode?: number, originalError?: Error, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || LimitRequestError.DEFAULT_MESSAGE;
        super(BadRequestError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }
}
