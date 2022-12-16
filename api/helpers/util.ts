import { NotFoundError } from './errors';

export const isNumber = (value: string): boolean => {
    return value != null && value !== '' && !Number.isNaN(Number(value));
};

export const trimIfDefined = (field: undefined|string): undefined|string => {
    return field === undefined ? field : field.trim();
};

export const sanitizeSequelizeLike = (term: string): string => {
    return term.replace('\\', '\\\\')
        .replace('%', '\\%')
        .replace('_', '\\_');
};

export const changeNotFoundError = (model: string, id: number): (error: unknown) => never => {
    return (error: unknown) => {
        if (error instanceof NotFoundError) {
            throw new NotFoundError(NotFoundError.generateMessage(model, id));
        }
        throw error;
    };
};

export const camelize = (str: string): string => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
};

export const getValueFromEnum = (value: string, enumClass: Record<string, string>): string | null => {
    const enumValue = (Object.values(enumClass)).find((a) => a === value);
    if (!enumValue) {
        return null;
    }
    return enumValue;
};

export const monthDifferenceBetweenDates = (d1: Date, d2: Date): number => {
    const year1 = d1.getFullYear();
    const year2 = d2.getFullYear();
    let month1 = d1.getMonth();
    let month2 = d2.getMonth();
    if (month1 === 0) { // Have to take into account
        month1 += 1;
        month2 += 1;
    }
    return (year2 - year1) * 12 + (month2 - month1);
};

export const monthDifferenceBetweenDatesWithDays = (d1: Date, d2: Date): number => {
    const year1 = d1.getFullYear();
    const year2 = d2.getFullYear();
    let month1 = d1.getMonth();
    let month2 = d2.getMonth();
    const day1 = d1.getDay();
    const day2 = d2.getDay();

    if (month1 === 0) { // Have to take into account
        month1 += 1;
        month2 += 1;
    }
    const result = (year2 - year1) * 12 + (month2 - month1) - ((day2 - day1 < 0) ? 1 : 0);

    if (result < 0) {
        return 0;
    }
    return result;
};
