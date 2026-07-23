import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { timer, switchMap, Subscription } from 'rxjs';
import { EventsTransport } from './events-transport';
import { toAppError, type AppError } from '../../core/errors/app-error';
import type { WebhookEventDto } from './events.types';

const POLL_INTERVAL_MS = 10_000;

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

@Injectable()
export class EventsService implements OnDestroy {
  private readonly transport = inject(EventsTransport);

  private readonly _state = signal<LoadState>('idle');
  private readonly _events = signal<WebhookEventDto[]>([]);
  private readonly _error = signal<AppError | null>(null);
  private readonly _paused = signal<boolean>(false);

  readonly state = this._state.asReadonly();
  readonly events = this._events.asReadonly();
  readonly error = this._error.asReadonly();
  readonly paused = this._paused.asReadonly();
  readonly isEmpty = computed(() => this._state() === 'loaded' && this._events().length === 0);

  private pollingSubscription: Subscription | null = null;
  private currentWabaId: string | null = null;

  startPolling(wabaId: string): void {
    this.currentWabaId = wabaId;
    this.stopPolling();

    this.pollingSubscription = timer(0, POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => {
          if (this._paused()) return [];
          this._state.set('loading');
          return this.transport.getEvents(wabaId);
        }),
      )
      .subscribe({
        next: (events) => {
          this._events.set(events);
          this._state.set('loaded');
          this._error.set(null);
        },
        error: (err: unknown) => {
          this._error.set(toAppError(err));
          this._state.set('error');
        },
      });
  }

  togglePause(): void {
    this._paused.update((v) => !v);
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
