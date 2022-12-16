import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import GenericError from './genericError';

export class DatabaseError extends GenericError {
    static DEFAULT_MESSAGE = 'Database error';
    static STATUS_CODE = INTERNAL_SERVER_ERROR;

    constructor(originalError?: Error, errorCode?: number, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = DatabaseError.DEFAULT_MESSAGE;
        super(DatabaseError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }
}
