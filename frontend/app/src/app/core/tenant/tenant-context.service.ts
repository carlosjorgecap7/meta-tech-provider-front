import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Placeholder: en fase 2 resolverá el tenantId desde el claim del JWT
 * o desde el subdominio/path según la decisión arquitectónica pendiente.
 */
@Injectable({ providedIn: 'root' })
export class TenantContextService {
  readonly tenantId = signal<string>(environment.tenant.defaultTenantId);
}
