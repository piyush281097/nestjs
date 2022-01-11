import { ConsoleLogger } from '@nestjs/common';
export declare class Logger extends ConsoleLogger {
    prettyPrintLog: boolean;
    constructor(context?: any, options?: {});
    private init;
    log(message: any, ...args: any[]): void;
    error(message: any, ...args: any[]): void;
    warn(message: any, ...args: any[]): void;
    debug(message: any, ...args: any[]): void;
    verbose(message: any, ...args: any[]): void;
    private isPrettyPrint;
    private printPlain;
    private isObject;
}
