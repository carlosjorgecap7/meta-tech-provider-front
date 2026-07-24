import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  inject,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { MessagesService } from './messages.service';
import { userFacingMessage } from '../../core/errors/app-error';

@Component({
  selector: 'app-conversation-view',
  imports: [CommonModule, FormsModule, CardModule, ButtonModule, TextareaModule, MessageModule, ProgressSpinnerModule],
  providers: [MessagesService],
  templateUrl: './conversation-view.html',
  styleUrl: './conversation-view.css',
})
export class ConversationView implements OnInit, OnDestroy, AfterViewChecked {
  readonly service = inject(MessagesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef<HTMLElement>;

  readonly replyText = signal<string>('');
  readonly errorMessage = signal<string | null>(null);
  private shouldScrollToBottom = true;

  wabaId = '';
  fromNumber = '';

  ngOnInit(): void {
    this.wabaId = this.route.snapshot.paramMap.get('wabaId') ?? '';
    this.fromNumber = this.route.snapshot.paramMap.get('from') ?? '';
    this.service.startPolling(this.wabaId, this.fromNumber);
  }

  ngOnDestroy(): void {
    this.service.stopPolling();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  goBack(): void {
    this.router.navigate(['/inbox']);
  }

  async sendReply(): Promise<void> {
    const text = this.replyText().trim();
    if (!text || this.service.sending()) return;

    this.errorMessage.set(null);
    this.replyText.set('');
    this.shouldScrollToBottom = true;

    try {
      await this.service.send(text);
    } catch (err) {
      const appError = err instanceof Error ? err : new Error(String(err));
      this.errorMessage.set(appError.message || 'Failed to send message. Please try again.');
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void this.sendReply();
    }
  }

  private scrollToBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
      this.shouldScrollToBottom = false;
    }
  }

  onMessagesUpdated(): void {
    this.shouldScrollToBottom = true;
  }

  formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
