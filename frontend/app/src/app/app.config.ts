import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';

import { routes } from './app.routes';
import { authInterceptor } from './core/http/auth.interceptor';
import { loggingInterceptor } from './core/http/logging.interceptor';
import { errorInterceptor } from './core/http/error.interceptor';
import { mockInterceptor } from './core/http/mock.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loggingInterceptor,
        ...(environment.useMockBackend ? [mockInterceptor] : []),
        errorInterceptor,
      ]),
    ),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.dark-mode' },
      },
      ripple: true,
    }),
    MessageService,
  ],
};
