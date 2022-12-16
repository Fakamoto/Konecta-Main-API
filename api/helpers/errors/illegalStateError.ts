import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import GenericError from './genericError';

export class IllegalStateError extends GenericError {
    static DEFAULT_MESSAGE = 'Internal Server Error';
    static STATUS_CODE = INTERNAL_SERVER_ERROR;

    constructor(message?: string, originalError?: Error, errorCode?: number, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || IllegalStateError.DEFAULT_MESSAGE;
        super(IllegalStateError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }
}
