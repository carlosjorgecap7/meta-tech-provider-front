import type { HttpInterceptorFn } from '@angular/common/http';

/**
 * Placeholder: añadirá el token Bearer de Cognito/Auth0 cuando se implemente la autenticación.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
