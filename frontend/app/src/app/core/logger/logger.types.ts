export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

export interface LogSink {
  log(level: LogLevel, message: string, context?: LogContext): void;
}
