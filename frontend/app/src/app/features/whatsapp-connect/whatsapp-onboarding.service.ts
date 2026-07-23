import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { ExchangeRequestDto, ExchangeResponseDto } from './whatsapp-onboarding.types';
import type { WabaDto } from '../wabas/wabas.types';
import type { WebhookEventDto } from '../events/events.types';

@Injectable({ providedIn: 'root' })
export class WhatsappOnboardingService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.api.baseUrl;

  exchange(payload: ExchangeRequestDto): Observable<ExchangeResponseDto> {
    return this.http.post<ExchangeResponseDto>(`${this.base}/onboarding/exchange`, payload);
  }

  getWabas(tenantId: string): Observable<WabaDto[]> {
    return this.http.get<WabaDto[]>(`${this.base}/wabas`, {
      params: { tenantId },
    });
  }

  getEvents(wabaId: string): Observable<WebhookEventDto[]> {
    return this.http.get<WebhookEventDto[]>(`${this.base}/events`, {
      params: { wabaId },
    });
  }
}
