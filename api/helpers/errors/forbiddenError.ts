import { FORBIDDEN } from 'http-status-codes';
import GenericError from './genericError';

export class ForbiddenError extends GenericError {
    static DEFAULT_MESSAGE = 'Forbidden';
    static STATUS_CODE = FORBIDDEN;

    constructor(message?: string, originalError?: Error, errorCode?: number, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || ForbiddenError.DEFAULT_MESSAGE;
        super(ForbiddenError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }
}
