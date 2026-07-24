import { Injectable, inject, signal, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, switchMap, Subscription, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { toAppError, type AppError } from '../../core/errors/app-error';
import type { MessageDto, SendReplyResponse } from './inbox.types';

const POLL_INTERVAL_MS = 5_000;
type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

@Injectable()
export class MessagesService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly base = environment.api.baseUrl;

  private readonly _state = signal<LoadState>('idle');
  private readonly _messages = signal<MessageDto[]>([]);
  private readonly _error = signal<AppError | null>(null);
  private readonly _sending = signal<boolean>(false);

  readonly state = this._state.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly error = this._error.asReadonly();
  readonly sending = this._sending.asReadonly();

  private pollingSubscription: Subscription | null = null;
  private currentWabaId = '';
  private currentFrom = '';

  startPolling(wabaId: string, from: string): void {
    this.currentWabaId = wabaId;
    this.currentFrom = from;
    this.stopPolling();

    this.pollingSubscription = timer(0, POLL_INTERVAL_MS)
      .pipe(
        switchMap(() => {
          this._state.set('loading');
          return this.http.get<MessageDto[]>(
            `${this.base}/conversations/${wabaId}/${encodeURIComponent(from)}/messages`,
          );
        }),
      )
      .subscribe({
        next: (messages) => {
          this._messages.set(messages);
          this._state.set('loaded');
          this._error.set(null);
        },
        error: (err: unknown) => {
          this._error.set(toAppError(err));
          this._state.set('error');
        },
      });
  }

  send(text: string): Promise<void> {
    if (this._sending()) return Promise.resolve();

    this._sending.set(true);

    return new Promise((resolve, reject) => {
      this.http
        .post<SendReplyResponse>(
          `${this.base}/conversations/${this.currentWabaId}/${encodeURIComponent(this.currentFrom)}/reply`,
          { text },
        )
        .subscribe({
          next: () => {
            // Optimistic update: add sent message immediately
            const sent: MessageDto = {
              messageId: `local_${Date.now()}`,
              direction: 'OUT',
              content: text,
              status: 'sent',
              createdAt: new Date().toISOString(),
              from: this.currentFrom,
            };
            this._messages.update((msgs) => [...msgs, sent]);
            this._sending.set(false);
            resolve();
          },
          error: (err: unknown) => {
            this._error.set(toAppError(err));
            this._sending.set(false);
            reject(err);
          },
        });
    });
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = null;
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
