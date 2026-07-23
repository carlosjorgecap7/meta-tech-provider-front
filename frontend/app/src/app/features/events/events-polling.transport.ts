import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { WhatsappOnboardingService } from '../whatsapp-connect/whatsapp-onboarding.service';
import { EventsTransport } from './events-transport';
import type { WebhookEventDto } from './events.types';

@Injectable()
export class EventsPollingTransport extends EventsTransport {
  private readonly onboarding = inject(WhatsappOnboardingService);

  getEvents(wabaId: string): Observable<WebhookEventDto[]> {
    return this.onboarding.getEvents(wabaId);
  }
}
