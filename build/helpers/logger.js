"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const winston_1 = __importStar(require("winston"));
const nodeEnv = process.env.NODE_ENV || 'development';
const logLevel = nodeEnv === 'production' ? 'info' : 'debug';
const logFilePath = path_1.default.join(__dirname, '../../logs/app.log');
const customFormat = winston_1.format.printf(({ level, message, timestamp, ctx, scope }) => {
    return `${timestamp} [${ctx}] [${scope}] ${level}: ${message}`;
});
const transportsArray = [
    new winston_1.default.transports.Console({
        level: logLevel,
        handleExceptions: true,
        format: winston_1.format.combine(winston_1.format.colorize(), winston_1.format.simple()),
        stderrLevels: ['error', 'warn']
    })
];
if (nodeEnv === 'production') {
    transportsArray.push(new winston_1.transports.File({
        level: 'info',
        filename: logFilePath,
        handleExceptions: true,
        maxsize: 5242880,
        maxFiles: 10,
        format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json())
    }));
}
const logger = winston_1.default.createLogger({
    transports: transportsArray,
    format: winston_1.format.combine(winston_1.format.timestamp(), customFormat),
    exitOnError: false
});
const log = (ctx, message, scope) => {
    const obj = { ctx, message, scope };
    logger.info(obj);
};
const requestLoggerMiddleware = (req, _res, next) => {
    const { method, url, headers, body } = req;
    logger.info('request: ', {
        method,
        url,
        headers,
        body
    });
    next();
};
// Error handling
process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    // You might want to terminate the process or perform other cleanup here.
});
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    // Perform cleanup and exit the process if needed.
    process.exit(1);
});
// Ensure that the process exits gracefully on termination signals
process.on('SIGINT', () => {
    logger.info('Received SIGINT. Shutting down gracefully.');
    process.exit(0);
});
process.on('SIGTERM', () => {
    logger.info('Received SIGTERM. Shutting down gracefully.');
    process.exit(0);
});
exports.default = { log, requestLoggerMiddleware };
//# sourceMappingURL=logger.js.map