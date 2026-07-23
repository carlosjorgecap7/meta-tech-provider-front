import { inject } from '@angular/core';
import { HttpResponse, type HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);
  const start = Date.now();

  logger.debug(`HTTP → ${req.method} ${req.url}`);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          logger.debug(`HTTP ← ${req.method} ${req.url} ${event.status} (${Date.now() - start}ms)`);
        }
      },
      error: (err: unknown) => {
        logger.error(`HTTP ✗ ${req.method} ${req.url}`, {
          error: String(err),
          duration: Date.now() - start,
        });
      },
    }),
  );
};
