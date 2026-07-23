import type { LogContext, LogLevel, LogSink } from '../logger.types';

export class ConsoleSink implements LogSink {
  log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const payload = context ? { ...context } : undefined;
    console[level](`[${timestamp}] ${message}`, ...(payload ? [payload] : []));
  }
}
