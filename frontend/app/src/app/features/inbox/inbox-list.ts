import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';

import { ConversationsService } from './conversations.service';
import { TenantContextService } from '../../core/tenant/tenant-context.service';
import { userFacingMessage } from '../../core/errors/app-error';
import type { ConversationDto } from './inbox.types';

// In a real multi-WABA setup this would come from a WABA selector.
// For MVP, use the first connected WABA or a hardcoded dev value.
const DEV_WABA_ID = 'waba_001';

@Component({
  selector: 'app-inbox-list',
  imports: [CommonModule, CardModule, ButtonModule, MessageModule, ProgressSpinnerModule, BadgeModule],
  providers: [ConversationsService],
  templateUrl: './inbox-list.html',
  styleUrl: './inbox-list.css',
})
export class InboxList implements OnInit, OnDestroy {
  readonly service = inject(ConversationsService);
  private readonly router = inject(Router);

  readonly errorMessage = computed(() => {
    const err = this.service.error();
    return err ? userFacingMessage(err) : null;
  });

  ngOnInit(): void {
    this.service.startPolling(DEV_WABA_ID);
  }

  ngOnDestroy(): void {
    this.service.stopPolling();
  }

  openConversation(conv: ConversationDto): void {
    this.router.navigate(['/inbox', conv.wabaId, conv.from]);
  }

  timeAgo(isoDate: string): string {
    const diff = Date.now() - new Date(isoDate).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
}
