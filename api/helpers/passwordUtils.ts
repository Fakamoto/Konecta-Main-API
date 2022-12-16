import bcrypt from 'bcrypt';
import { BadRequestError, GenericInternalServerError } from './errors';
import { ValidationConstants } from './sequelizeModelValidation';

export const validatePassword = (password: string): void => {
    if (password == null) {
        throw new GenericInternalServerError(undefined, undefined,
            undefined, 'Missing password when validating user');
    }
    const maxLength = ValidationConstants.MAX_STRING;
    const minLength = ValidationConstants.MIN_PASSWORD_LENGTH;
    if (password.length < minLength || password.length > maxLength) {
        throw new BadRequestError(`Password length should be between ${minLength} and ${maxLength}`);
    }
};

export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10)
        .catch((error: any) => { throw new GenericInternalServerError('Error generating password', error); });
};
