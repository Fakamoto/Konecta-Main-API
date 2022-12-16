/* eslint-disable */
import { registerDecorator, ValidationArguments } from 'class-validator';
import { getValueFromEnum } from '../util';

export default function belongsToEnum(enumClass: Record<string, string>, enumName: string) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'BelongsToEnum',
            target: object.constructor,
            propertyName,
            constraints: [enumClass],
            options: { message: `Value in field ${propertyName} not found in enum: ${enumName}` },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const enumRecord = args.constraints[0] as Record<string, string>;
                    return !!getValueFromEnum(value, enumRecord);
                },
            },
        });
    };
}
