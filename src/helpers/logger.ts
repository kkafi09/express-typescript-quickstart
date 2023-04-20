import winston, { format, Logger, transports } from 'winston';

const logger: Logger = winston.createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      handleExceptions: true,
      format: format.combine(format.colorize(), format.simple())
    })
  ],
  exitOnError: false
});

const log = (ctx: string, message: string, scope: string) => {
  const obj = { ctx, message, scope };
  logger.info(obj);
};

export default { log };
