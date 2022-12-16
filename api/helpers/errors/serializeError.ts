import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import GenericError from './genericError';

export class SerializeError extends GenericError {
    static DEFAULT_MESSAGE = 'Error serializing data';
    static STATUS_CODE = INTERNAL_SERVER_ERROR;

    constructor(message?: string, originalError?: Error, errorCode?: number, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || SerializeError.DEFAULT_MESSAGE;
        super(SerializeError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }
}
