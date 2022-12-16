import { UNAUTHORIZED } from 'http-status-codes';
import GenericError from './genericError';

export class UnauthorizedError extends GenericError {
    static DEFAULT_MESSAGE = 'Unauthorized';
    static STATUS_CODE = UNAUTHORIZED;

    constructor(message?: string, originalError?: Error, errorCode?: number, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || UnauthorizedError.DEFAULT_MESSAGE;
        super(UnauthorizedError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }
}
