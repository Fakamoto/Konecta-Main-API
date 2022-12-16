import { NOT_FOUND } from 'http-status-codes';
import GenericError from './genericError';

export class NotFoundError extends GenericError {
    static DEFAULT_MESSAGE = 'Not found';
    static STATUS_CODE = NOT_FOUND;

    constructor(message?: string, originalError?: Error, errorCode?: number, logMessage?: string, frontendMessage?: string) {
        const errorMessage: string = message || NotFoundError.DEFAULT_MESSAGE;
        super(NotFoundError.STATUS_CODE, errorMessage, errorCode, originalError, logMessage, frontendMessage);
    }

    static generateMessage(modelName: string, id: number|string): string {
        return `${modelName} not found for id ${id}`;
    }
}
