export type WebhookEventType = 'MESSAGE_RECEIVED' | 'MESSAGE_DELIVERED' | 'MESSAGE_READ' | 'MESSAGE_FAILED';

export interface WebhookEventDto {
  eventId: string;
  type: WebhookEventType;
  wabaId: string;
  phoneNumberId: string;
  from: string;
  content: string | null;
  timestamp: string;
}
