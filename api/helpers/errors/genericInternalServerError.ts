import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import GenericError from './genericError';

export class GenericInternalServerError extends GenericError {
    static DEFAULT_MESSAGE = 'Internal server error';
    static STATUS_CODE = INTERNAL_SERVER_ERROR;

    constructor(message?: string, originalError?: Error, errorCode?: number, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || GenericInternalServerError.DEFAULT_MESSAGE;
        super(GenericInternalServerError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage,
            frontendMessage);
    }
}
