import { inject } from '@angular/core';
import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { BackendError, NetworkError } from '../errors/app-error';
import { LoggerService } from '../logger/logger.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 0) {
          const networkError: NetworkError = {
            type: 'NetworkError',
            message: 'Sin conexión con el servidor.',
          };
          logger.error('Network error', { url: req.url });
          return throwError(() => networkError);
        }

        const body = err.error as Record<string, unknown> | null;
        const backendError: BackendError = {
          type: 'BackendError',
          statusCode: err.status,
          code: typeof body?.['code'] === 'string' ? body['code'] : 'UNKNOWN',
          message:
            typeof body?.['message'] === 'string'
              ? body['message']
              : err.message,
        };
        logger.error('Backend error', { statusCode: err.status, url: req.url, code: backendError.code });
        return throwError(() => backendError);
      }
      return throwError(() => err);
    }),
  );
};
