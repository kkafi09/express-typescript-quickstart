import { NextFunction, Request, Response } from 'express';
import path from 'path';
import winston, { Logger, format, transport, transports } from 'winston';

const nodeEnv = process.env.NODE_ENV || 'development';
const logLevel = nodeEnv === 'production' ? 'info' : 'debug';
const logFilePath = path.join(__dirname, '../../logs/app.log');

const customFormat = format.printf(({ level, message, timestamp, ctx, scope }) => {
  return `${timestamp} [${ctx}] [${scope}] ${level}: ${message}`;
});

const transportsArray: transport[] = [
  new winston.transports.Console({
    level: logLevel,
    handleExceptions: true,
    format: format.combine(format.colorize(), format.simple()),
    stderrLevels: ['error', 'warn']
  })
];

if (nodeEnv === 'production') {
  transportsArray.push(
    new transports.File({
      level: 'info',
      filename: logFilePath,
      handleExceptions: true,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      format: format.combine(format.timestamp(), format.json())
    })
  );
}

const logger: Logger = winston.createLogger({
  transports: transportsArray,
  format: format.combine(format.timestamp(), customFormat),
  exitOnError: false
});

const log = (ctx: string, message: string, scope: string) => {
  const obj = { ctx, message, scope };
  logger.info(obj);
};

const requestLoggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
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

export default { log, requestLoggerMiddleware };
