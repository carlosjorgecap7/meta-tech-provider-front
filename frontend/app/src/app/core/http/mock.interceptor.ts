/**
 * MOCK — Simula las respuestas del backend AWS.
 * Solo activo cuando environment.useMockBackend === true.
 * Eliminar o condicionar en cuanto el backend real esté disponible.
 */
import { HttpResponse, type HttpInterceptorFn } from '@angular/common/http';
import { of, delay } from 'rxjs';
import type { WabaDto } from '../../features/wabas/wabas.types';
import type { WebhookEventDto } from '../../features/events/events.types';
import type { ExchangeResponseDto } from '../../features/whatsapp-connect/whatsapp-onboarding.types';

const MOCK_DELAY_MS = 600;

const MOCK_WABAS: WabaDto[] = [
  {
    wabaId: 'waba_001',
    tenantId: 'mapfre',
    displayName: 'Mapfre Seguros',
    phoneNumberId: 'pn_001',
    phoneNumber: '+34 900 100 200',
    status: 'ACTIVE',
    connectedAt: '2025-11-15T10:00:00Z',
  },
  {
    wabaId: 'waba_002',
    tenantId: 'mapfre',
    displayName: 'Mapfre Asistencia',
    phoneNumberId: 'pn_002',
    phoneNumber: '+34 900 100 201',
    status: 'PENDING',
    connectedAt: '2025-12-01T09:30:00Z',
  },
];

const MOCK_EVENTS: WebhookEventDto[] = [
  {
    eventId: 'evt_001',
    type: 'MESSAGE_RECEIVED',
    wabaId: 'waba_001',
    phoneNumberId: 'pn_001',
    from: '+34600000001',
    content: 'Hola, ¿podéis ayudarme?',
    timestamp: new Date(Date.now() - 120_000).toISOString(),
  },
  {
    eventId: 'evt_002',
    type: 'MESSAGE_DELIVERED',
    wabaId: 'waba_001',
    phoneNumberId: 'pn_001',
    from: '+34600000002',
    content: null,
    timestamp: new Date(Date.now() - 60_000).toISOString(),
  },
];

export const mockInterceptor: HttpInterceptorFn = (req, next) => {
  const { method, url } = req;
  const path = new URL(url, 'http://localhost').pathname;

  if (method === 'POST' && path === '/onboarding/exchange') {
    const body: ExchangeResponseDto = {
      wabaId: 'waba_mock_' + Date.now(),
      phoneNumberId: 'pn_mock_' + Date.now(),
      status: 'PENDING',
    };
    return of(new HttpResponse({ status: 200, body })).pipe(delay(MOCK_DELAY_MS));
  }

  if (method === 'GET' && path === '/wabas') {
    return of(new HttpResponse({ status: 200, body: MOCK_WABAS })).pipe(delay(MOCK_DELAY_MS));
  }

  if (method === 'GET' && path === '/events') {
    return of(new HttpResponse({ status: 200, body: MOCK_EVENTS })).pipe(delay(MOCK_DELAY_MS));
  }

  return next(req);
};
