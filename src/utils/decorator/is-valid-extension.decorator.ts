import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidExtension(
  s3FileExtensions: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    const defaultValidationOptions = {
      message: `File does not have valid extension`,
    };
    registerDecorator({
      name: 'IsValidExtension',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions
        ? { ...defaultValidationOptions, ...validationOptions }
        : defaultValidationOptions,
      validator: {
        validate(value: string | string[]) {
          let isValid = true;
          const validateExt = (fileName: string) => {
            const fileExtension = fileName.split('.').pop();
            return s3FileExtensions.includes(fileExtension);
          };
          if (typeof value === 'string') {
            isValid = validateExt(value);
          } else {
            for (const fileName of value) {
              isValid = validateExt(fileName);
              if (!isValid) break;
            }
          }
          return isValid;
        },
      },
    });
  };
}
