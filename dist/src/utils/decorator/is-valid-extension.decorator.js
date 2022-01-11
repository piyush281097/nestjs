"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValidExtension = void 0;
const class_validator_1 = require("class-validator");
function IsValidExtension(s3FileExtensions, validationOptions) {
    return function (object, propertyName) {
        const defaultValidationOptions = {
            message: `File does not have valid extension`,
        };
        (0, class_validator_1.registerDecorator)({
            name: 'IsValidExtension',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions
                ? { ...defaultValidationOptions, ...validationOptions }
                : defaultValidationOptions,
            validator: {
                validate(value) {
                    let isValid = true;
                    const validateExt = (fileName) => {
                        const fileExtension = fileName.split('.').pop();
                        return s3FileExtensions.includes(fileExtension);
                    };
                    if (typeof value === 'string') {
                        isValid = validateExt(value);
                    }
                    else {
                        for (const fileName of value) {
                            isValid = validateExt(fileName);
                            if (!isValid)
                                break;
                        }
                    }
                    return isValid;
                },
            },
        });
    };
}
exports.IsValidExtension = IsValidExtension;
//# sourceMappingURL=is-valid-extension.decorator.js.map