"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const common_1 = require("@nestjs/common");
let Logger = class Logger extends common_1.ConsoleLogger {
    constructor(context, options = {}) {
        super(context, options);
        this.init();
    }
    init() {
        const LOGGER_LEVEL = process.env.LOGGER_LEVEL || 'log';
        const loggerLevel = ['error', 'warn', 'log', 'debug'];
        const envLogIndex = loggerLevel.findIndex((i) => i === LOGGER_LEVEL);
        this.setLogLevels(loggerLevel.slice(0, envLogIndex + 1));
        this.prettyPrintLog = JSON.parse(process.env.PRETTY_PRINT_LOG || 'false');
    }
    log(message, ...args) {
        if (!this.isLevelEnabled('log')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.log.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'log');
    }
    error(message, ...args) {
        if (!this.isLevelEnabled('error')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.error.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'error');
    }
    warn(message, ...args) {
        if (!this.isLevelEnabled('warn')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.warn.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'warn');
    }
    debug(message, ...args) {
        if (!this.isLevelEnabled('debug')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.debug.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'debug');
    }
    verbose(message, ...args) {
        if (!this.isLevelEnabled('verbose')) {
            return;
        }
        if (this.isPrettyPrint()) {
            super.verbose.apply(this, [message, ...args]);
            return;
        }
        this.printPlain(message, 'debug');
    }
    isPrettyPrint() {
        return this.prettyPrintLog;
    }
    printPlain(message, level) {
        const formattedLog = `[${this.context || 'NA'}] ${this.isObject(message) ? JSON.stringify(message) : message}`;
        console[level](formattedLog);
    }
    isObject(a) {
        return !!a && a.constructor === Object;
    }
};
Logger = __decorate([
    (0, common_1.Injectable)({
        scope: common_1.Scope.TRANSIENT,
    }),
    __metadata("design:paramtypes", [Object, Object])
], Logger);
exports.Logger = Logger;
//# sourceMappingURL=logging.service.js.map