import winston from 'winston';
import { Logger } from '@/presentation/protocols/logger';

export class WinstonLogger implements Logger {
  winstonLogger: winston.Logger;

  constructor() {
    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        new winston.transports.Console(),
      ],
    });
  }

  info(message: string, payload?: any): void {
    this.winstonLogger.info(message, payload);
  }

  error(message: string, payload?: any): void {
    this.winstonLogger.error(message, payload);
  }
}
