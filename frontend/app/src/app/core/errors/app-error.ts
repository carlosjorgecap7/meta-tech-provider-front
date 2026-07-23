export type AppErrorCode =
  | 'SDK_LOAD_FAILED'
  | 'SDK_LOGIN_FAILED'
  | 'USER_CANCELLED'
  | 'NETWORK_ERROR'
  | 'BACKEND_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN';

export interface SdkLoadError {
  type: 'SdkLoadError';
  message: string;
}

export interface SdkLoginError {
  type: 'SdkLoginError';
  status: string;
  message: string;
}

export interface UserCancelledError {
  type: 'UserCancelledError';
}

export interface NetworkError {
  type: 'NetworkError';
  message: string;
}

export interface BackendError {
  type: 'BackendError';
  statusCode: number;
  code: string;
  message: string;
}

export interface ValidationError {
  type: 'ValidationError';
  field?: string;
  message: string;
}

export interface UnknownError {
  type: 'UnknownError';
  message: string;
}

export type AppError =
  | SdkLoadError
  | SdkLoginError
  | UserCancelledError
  | NetworkError
  | BackendError
  | ValidationError
  | UnknownError;

export function toAppError(err: unknown): AppError {
  if (err && typeof err === 'object' && 'type' in err) {
    return err as AppError;
  }
  const message = err instanceof Error ? err.message : String(err);
  return { type: 'UnknownError', message };
}

export function userFacingMessage(error: AppError): string {
  switch (error.type) {
    case 'UserCancelledError':
      return 'You cancelled the process. You can try again whenever you are ready.';
    case 'SdkLoadError':
      return 'Failed to load the Meta SDK. Check your connection and try again.';
    case 'SdkLoginError':
      return `Meta login failed: ${error.message}`;
    case 'NetworkError':
      return 'Network error. Check your connection and try again.';
    case 'BackendError':
      return error.message || 'Server error. Please try again later.';
    case 'ValidationError':
      return error.message;
    case 'UnknownError':
      return 'An unexpected error occurred. Please try again.';
  }
}
