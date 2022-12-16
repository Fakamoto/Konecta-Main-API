import { CONFLICT } from 'http-status-codes';
import GenericError from './genericError';

export class RequestConflictError extends GenericError {
    static DEFAULT_MESSAGE = 'Conflict';
    static STATUS_CODE = CONFLICT;

    constructor(message?: string, originalError?: Error, errorCode?: number, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || RequestConflictError.DEFAULT_MESSAGE;
        super(RequestConflictError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }
}
