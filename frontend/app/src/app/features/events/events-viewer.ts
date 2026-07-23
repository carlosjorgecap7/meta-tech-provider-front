import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsService } from './events.service';
import { EventsTransport } from './events-transport';
import { EventsPollingTransport } from './events-polling.transport';
import { userFacingMessage } from '../../core/errors/app-error';
import type { WebhookEventType } from './events.types';

@Component({
  selector: 'app-events-viewer',
  imports: [CommonModule],
  providers: [EventsService, { provide: EventsTransport, useClass: EventsPollingTransport }],
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

  eventSeverity(type: WebhookEventType): string {
    switch (type) {
      case 'MESSAGE_RECEIVED':
        return 'status-info';
      case 'MESSAGE_DELIVERED':
        return 'status-success';
      case 'MESSAGE_READ':
        return 'status-success';
      case 'MESSAGE_FAILED':
        return 'status-error';
    }
  }

  eventLabel(type: WebhookEventType): string {
    switch (type) {
      case 'MESSAGE_RECEIVED':
        return 'Received';
      case 'MESSAGE_DELIVERED':
        return 'Delivered';
      case 'MESSAGE_READ':
        return 'Read';
      case 'MESSAGE_FAILED':
        return 'Failed';
    }
  }
}
