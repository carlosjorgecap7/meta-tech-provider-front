import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { FacebookSdkService } from '../../core/meta/facebook-sdk.service';
import { WhatsappOnboardingService } from './whatsapp-onboarding.service';
import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { LoggerService } from '../../core/logger/logger.service';
import {
  isEmbeddedSignupMessage,
  isFinishMessage,
} from '../../core/meta/embedded-signup.types';
import {
  toAppError,
  userFacingMessage,
  type AppError,
} from '../../core/errors/app-error';
import type { SdkLoginError, UserCancelledError } from '../../core/errors/app-error';
import type { ExchangeResponseDto } from './whatsapp-onboarding.types';

type ComponentState = 'idle' | 'sdk-loading' | 'connecting' | 'success' | 'error';

@Component({
  selector: 'app-whatsapp-connect',
  imports: [CommonModule, ButtonModule, CardModule, MessageModule, ProgressSpinnerModule],
  templateUrl: './whatsapp-connect.html',
  styleUrl: './whatsapp-connect.css',
})
export class WhatsappConnect implements OnInit, OnDestroy {
  private readonly sdk = inject(FacebookSdkService);
  private readonly onboarding = inject(WhatsappOnboardingService);
  private readonly tenant = inject(TenantContextService);
  private readonly logger = inject(LoggerService);

  readonly state = signal<ComponentState>('idle');
  readonly error = signal<AppError | null>(null);
  readonly result = signal<ExchangeResponseDto | null>(null);

  readonly isLoading = computed(
    () => this.state() === 'sdk-loading' || this.state() === 'connecting',
  );
  readonly loadingLabel = computed(() =>
    this.state() === 'sdk-loading'
      ? 'Loading Meta SDK…'
      : 'Connecting to WhatsApp Business…',
  );
  readonly errorMessage = computed(() => {
    const err = this.error();
    return err ? userFacingMessage(err) : null;
  });

  private messageListener: ((event: MessageEvent) => void) | null = null;
  private pendingAuthCode: string | null = null;

  ngOnInit(): void {
    this.registerMessageListener();

    if (this.sdk.state() === 'idle') {
      this.state.set('sdk-loading');
      this.sdk.load();
    }
  }

  ngOnDestroy(): void {
    this.cleanupMessageListener();
  }

  async startSignup(): Promise<void> {
    if (this.isLoading()) return;

    this.error.set(null);
    this.result.set(null);

    if (this.sdk.state() !== 'ready') {
      this.state.set('sdk-loading');
      this.sdk.load();
      return;
    }

    this.state.set('connecting');

    try {
      const response = await this.sdk.login();

      if (response.status !== 'connected' || !response.authResponse?.code) {
        const loginError: SdkLoginError = {
          type: 'SdkLoginError',
          status: response.status,
          message: 'No authorization code received from Meta.',
        };
        this.state.set('error');
        this.error.set(loginError);
        return;
      }

      this.pendingAuthCode = response.authResponse.code;
      this.logger.info('FB.login exitoso, esperando postMessage de Embedded Signup');
    } catch (err) {
      this.state.set('error');
      this.error.set(toAppError(err));
    }
  }

  private registerMessageListener(): void {
    this.messageListener = (event: MessageEvent): void => {
      if (!event.origin.endsWith('.facebook.com') && event.origin !== 'https://www.facebook.com') {
        return;
      }

      if (!isEmbeddedSignupMessage(event.data)) return;

      if (isFinishMessage(event.data)) {
        const { waba_id: wabaId, phone_number_id: phoneNumberId } = event.data.data;
        this.logger.info('Embedded Signup FINISH', { wabaId, phoneNumberId });
        this.handleSignupFinish(wabaId, phoneNumberId);
      } else {
        const cancelledError: UserCancelledError = { type: 'UserCancelledError' };
        this.logger.info('Embedded Signup CANCEL', { step: event.data.data.current_step });
        this.state.set('error');
        this.error.set(cancelledError);
      }
    };

    window.addEventListener('message', this.messageListener);
  }

  private cleanupMessageListener(): void {
    if (this.messageListener) {
      window.removeEventListener('message', this.messageListener);
      this.messageListener = null;
    }
  }

  private handleSignupFinish(wabaId: string, phoneNumberId: string): void {
    if (!this.pendingAuthCode) {
      const loginError: SdkLoginError = {
        type: 'SdkLoginError',
        status: 'unknown',
        message: 'Authorization code expired or missing. Please try again.',
      };
      this.state.set('error');
      this.error.set(loginError);
      return;
    }

    const tenantId = this.tenant.tenantId();
    const code = this.pendingAuthCode;
    this.pendingAuthCode = null;

    this.onboarding
      .exchange({ code, wabaId, phoneNumberId, tenantId })
      .subscribe({
        next: (res) => {
          this.result.set(res);
          this.state.set('success');
          this.logger.info('Onboarding exchange completado', { wabaId, status: res.status });
        },
        error: (err: unknown) => {
          this.state.set('error');
          this.error.set(toAppError(err));
        },
      });
  }
}
