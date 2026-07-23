import type { Observable } from 'rxjs';
import type { WebhookEventDto } from './events.types';

/**
 * Interfaz de transporte abstracta para eventos de webhook.
 * Implementación actual: polling REST. Futura: SSE o WebSocket,
 * intercambiable sin cambiar EventsService ni el componente.
 */
export abstract class EventsTransport {
  abstract getEvents(wabaId: string): Observable<WebhookEventDto[]>;
}
