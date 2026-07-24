import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, switchMap, Subscription, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toAppError, type AppError } from '../../core/errors/app-error';
import type { ConversationDto } from './inbox.types';

const POLL_INTERVAL_MS = 10_000;
type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

@Injectable()
export class ConversationsService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly base = environment.api.baseUrl;

  private readonly _state = signal<LoadState>('idle');
  private readonly _conversations = signal<ConversationDto[]>([]);
  private readonly _error = signal<AppError | null>(null);
  private readonly _paused = signal<boolean>(false);

  readonly state = this._state.asReadonly();
  readonly conversations = this._conversations.asReadonly();
  readonly error = this._error.asReadonly();
  readonly paused = this._paused.asReadonly();
  readonly isEmpty = computed(
    () => this._state() === 'loaded' && this._conversations().length === 0,
  );

  private pollingSubscription: Subscription | null = null;

  startPolling(wabaId: string): void {
    this.stopPolling();

    this.pollingSubscription = timer(0, POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => {
          if (this._paused()) return of([]);
          this._state.set('loading');
          return this.http.get<ConversationDto[]>(`${this.base}/conversations`, {
            params: { wabaId },
          });
        }),
      )
      .subscribe({
        next: (conversations) => {
          this._conversations.set(conversations);
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
