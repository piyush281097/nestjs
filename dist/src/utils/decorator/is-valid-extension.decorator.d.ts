import { ValidationOptions } from 'class-validator';
export declare function IsValidExtension(s3FileExtensions: string[], validationOptions?: ValidationOptions): (object: unknown, propertyName: string) => void;
