import { Injectable, isDevMode } from '@angular/core';
import type { LogContext, LogSink } from './logger.types';
import { ConsoleSink } from './sinks/console.sink';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly sink: LogSink = new ConsoleSink();

  debug(message: string, context?: LogContext): void {
    if (isDevMode()) {
      this.sink.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.sink.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.sink.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.sink.log('error', message, context);
  }
}
