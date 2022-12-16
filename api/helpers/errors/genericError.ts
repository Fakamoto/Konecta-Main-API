// TODO see if we can remove inheritance with Error, it just creates more complex code
export default abstract class GenericError extends Error {
    code: number;
    originalError?: Error;
    errorCode?: number;
    logMessage?: string;
    frontendMessage?: string;

    protected constructor(code: number, message: string, errorCode?: number, originalError?: Error, logMessage?: string,
        frontendMessage?: string) {
        super(message);
        this.code = code;
        this.originalError = originalError;
        this.errorCode = errorCode;
        this.logMessage = logMessage;
        this.frontendMessage = frontendMessage;
    }
}
