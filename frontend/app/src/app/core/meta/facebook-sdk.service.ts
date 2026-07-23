import { Injectable, NgZone, OnDestroy, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import type { FbLoginOptions, FbLoginResponse } from './facebook-sdk.types';
import type { SdkLoadError } from '../errors/app-error';

export type SdkState = 'idle' | 'loading' | 'ready' | 'error';

@Injectable({ providedIn: 'root' })
export class FacebookSdkService implements OnDestroy {
  readonly state = signal<SdkState>('idle');

  private scriptEl: HTMLScriptElement | null = null;

  constructor(private readonly zone: NgZone) {}

  load(): void {
    if (this.state() !== 'idle') return;
    this.state.set('loading');

    window.fbAsyncInit = (): void => {
      window.FB?.init({
        appId: environment.meta.appId,
        version: environment.meta.sdkVersion,
        xfbml: true,
        cookie: true,
      });
      this.zone.run(() => this.state.set('ready'));
    };

    this.scriptEl = document.createElement('script');
    this.scriptEl.id = 'facebook-jssdk';
    this.scriptEl.src = 'https://connect.facebook.net/en_US/sdk.js';
    this.scriptEl.async = true;
    this.scriptEl.defer = true;
    this.scriptEl.onerror = (): void => {
      this.zone.run(() => this.state.set('error'));
    };

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode?.insertBefore(this.scriptEl, firstScript);
  }

  login(): Promise<FbLoginResponse> {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        const err: SdkLoadError = { type: 'SdkLoadError', message: 'window.FB no disponible' };
        reject(err);
        return;
      }

      const options: FbLoginOptions = {
        config_id: environment.meta.configId,
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: 'whatsapp_business_app_onboarding',
          sessionInfoVersion: '3',
        },
      };

      window.FB.login((response) => {
        this.zone.run(() => resolve(response));
      }, options);
    });
  }

  ngOnDestroy(): void {
    if (this.scriptEl) {
      this.scriptEl.remove();
      this.scriptEl = null;
    }
  }
}
