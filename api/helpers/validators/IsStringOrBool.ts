import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'string-or-bool', async: false })
export class IsStringOrBool implements ValidatorConstraintInterface {
    // eslint-disable-next-line no-unused-vars
    validate(value: any, args: ValidationArguments) {
        return typeof value === 'string' || typeof value === 'boolean';
    }

    // eslint-disable-next-line no-unused-vars
    defaultMessage(args: ValidationArguments) {
        return '($value) must be string or bool';
    }
}
