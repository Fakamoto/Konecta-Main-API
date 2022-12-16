import { BAD_REQUEST } from 'http-status-codes';
import GenericError from './genericError';

export class BadRequestError extends GenericError {
    static DEFAULT_MESSAGE = 'Bad request';
    static STATUS_CODE = BAD_REQUEST;

    constructor(message?: string, errorCode?: number, originalError?: Error, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || BadRequestError.DEFAULT_MESSAGE;
        super(BadRequestError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }
}
