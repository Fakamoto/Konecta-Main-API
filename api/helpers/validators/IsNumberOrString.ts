import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
    // eslint-disable-next-line no-unused-vars
    validate(text: any, args: ValidationArguments) {
        return typeof text === 'number' || typeof text === 'string';
    }

    // eslint-disable-next-line no-unused-vars
    defaultMessage(args: ValidationArguments) {
        return '($value) must be number or string';
    }
}
