import { Role } from '../models/role/role';
import { getValueFromEnum } from './util';

export const ValidationConstants = {
    MAX_STRING: 255,
    MAX_USER_NAME_LENGTH: 100,
    MAX_WP_USER_NAME_LENGTH: 100,
    MAX_WP_COUNTRY_NAME_LENGTH: 100,
    MAX_WP_DESCRIPTION_LENGTH: 124,
    MAX_WP_PHONE_NUMBER_LENGTH: 32,
    MAX_WP_EMAIL_LENGTH: 100,
    MAX_PASSWORD_LENGTH: 100,
    MAX_USER_DNI_LENGTH: 12,
    MAX_USER_CUIT_LENGTH: 12,
    MIN_PASSWORD_LENGTH: 4,
};

export const lengthValidation = (minLenght:number, maxLenght: number):
{msg: string, args: [number, number]} => {
    return {
        msg: `Length should be between ${minLenght} and ${maxLenght}`,
        args: [minLenght, maxLenght],
    };
};

export const emailValidation = { msg: 'Not a valid email' };
export const urlValidation = { msg: 'Not a valid url' };
export const roleValidation = (value: string): void => {
    if (!((Object.values(Role) as string[]).includes(value))) {
        throw new Error(`${value} is not a valid Role.`);
    }
};

export const enumValidator = (value: string, enumClass: Record<string, string>): void => {
    if (!getValueFromEnum(value, enumClass)) {
        throw new Error(`${value} is not a valid enum value.`);
    }
};
