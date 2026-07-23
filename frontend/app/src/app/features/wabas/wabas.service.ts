import { Injectable, inject, signal, computed } from '@angular/core';
import { WhatsappOnboardingService } from '../whatsapp-connect/whatsapp-onboarding.service';
import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { toAppError, type AppError } from '../../core/errors/app-error';
import type { WabaDto } from './wabas.types';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

@Injectable({ providedIn: 'root' })
export class WabasService {
  private readonly onboarding = inject(WhatsappOnboardingService);
  private readonly tenant = inject(TenantContextService);

  private readonly _state = signal<LoadState>('idle');
  private readonly _wabas = signal<WabaDto[]>([]);
  private readonly _error = signal<AppError | null>(null);

  readonly state = this._state.asReadonly();
  readonly wabas = this._wabas.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isEmpty = computed(() => this._state() === 'loaded' && this._wabas().length === 0);

  load(): void {
    this._state.set('loading');
    this._error.set(null);

    this.onboarding.getWabas(this.tenant.tenantId()).subscribe({
      next: (list) => {
        this._wabas.set(list);
        this._state.set('loaded');
      },
      error: (err: unknown) => {
        this._error.set(toAppError(err));
        this._state.set('error');
      },
    });
  }
}
