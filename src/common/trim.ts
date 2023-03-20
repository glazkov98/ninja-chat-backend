import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function Trim(validationOptions: ValidationOptions = {}) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'Trim',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: {
        message: 'String is empty',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          return value.trim();
        },
      },
    });
  };
}
