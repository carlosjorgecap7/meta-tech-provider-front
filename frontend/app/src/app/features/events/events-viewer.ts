import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { EventsService } from './events.service';
import { EventsTransport } from './events-transport';
import { EventsPollingTransport } from './events-polling.transport';
import { userFacingMessage } from '../../core/errors/app-error';
import type { WebhookEventType } from './events.types';

type TagSeverity = 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast';

@Component({
  selector: 'app-events-viewer',
  imports: [CommonModule, ButtonModule, CardModule, TableModule, TagModule, MessageModule, ProgressSpinnerModule],
  providers: [
    EventsService,
    { provide: EventsTransport, useClass: EventsPollingTransport },
  ],
  templateUrl: './events-viewer.html',
  styleUrl: './events-viewer.css',
})
export class EventsViewer implements OnInit {
  readonly service = inject(EventsService);

  ngOnInit(): void {
    this.service.startPolling('waba_001');
  }

  errorMessage(): string | null {
    const err = this.service.error();
    return err ? userFacingMessage(err) : null;
  }

  eventSeverity(type: WebhookEventType): TagSeverity {
    switch (type) {
      case 'MESSAGE_RECEIVED': return 'info';
      case 'MESSAGE_DELIVERED': return 'success';
      case 'MESSAGE_READ': return 'success';
      case 'MESSAGE_FAILED': return 'danger';
    }
  }

  eventLabel(type: WebhookEventType): string {
    switch (type) {
      case 'MESSAGE_RECEIVED': return 'Received';
      case 'MESSAGE_DELIVERED': return 'Delivered';
      case 'MESSAGE_READ': return 'Read';
      case 'MESSAGE_FAILED': return 'Failed';
    }
  }
}
