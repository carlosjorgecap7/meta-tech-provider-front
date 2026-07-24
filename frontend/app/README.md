# Meta Tech Provider — WhatsApp Business Frontend

MVP Angular del frontend de la plataforma multi-tenant de Capgemini que actúa como Meta Tech Provider para WhatsApp Business Platform.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Angular 21 (standalone, native control flow) |
| UI | PrimeNG 21 + Tailwind CSS 4 |
| State | Signals (Angular) |
| HTTP | HttpClient + interceptors funcionales |
| Estilos | CSS nativo + variables CSS de PrimeNG Aura |
| Lint | ESLint (flat config) + Prettier |
| Tests | Vitest (infra lista, specs pendientes) |

## Arranque rápido

```bash
npm install
npm start          # http://localhost:4200
npm run build      # build producción
npm run lint       # ESLint
npm run lint:fix   # ESLint con autofix
npm run format     # Prettier
```

## Variables de entorno

Los ficheros están en `src/environments/`:

| Fichero | Uso |
|---|---|
| `environment.ts` | Producción (por defecto) |
| `environment.development.ts` | `ng serve` y `ng build --configuration development` |

### Valores a rellenar antes de usar el flujo real:

```ts
// src/environments/environment.development.ts
meta: {
  appId: 'YOUR_META_APP_ID_DEV',          // App ID de tu Meta App (developers.facebook.com)
  configId: 'YOUR_EMBEDDED_SIGNUP_CONFIG_ID_DEV',  // config_id del flujo de Embedded Signup
}
```

> **Nota sobre config_id**: actualmente hay un único `config_id` global en environment.
> En fase 2, si cada tenant tiene el suyo, este valor vendrá del endpoint `GET /tenants/me`.

## Mock backend

En `environment.development.ts`, `useMockBackend: true` activa el `mockInterceptor`,
que intercepta las llamadas HTTP y devuelve datos hardcodeados de Mapfre.

Endpoints mockeados:
- `POST /onboarding/exchange` → responde con `wabaId` / `phoneNumberId` / `status: PENDING`
- `GET /wabas` → lista dos WABAs de Mapfre (una ACTIVE, una PENDING)
- `GET /events` → lista dos eventos de webhook recientes

Para usar el backend real: cambiar `useMockBackend: false` en `environment.development.ts`.

## Flujo de Embedded Signup

1. El usuario accede a `/connect`.
2. `FacebookSdkService.load()` inyecta el FB JS SDK de forma asíncrona.
3. Al pulsar el botón, `FB.login()` abre el popup de Meta.
4. El popup envía un `postMessage` con `event.data.type === 'WA_EMBEDDED_SIGNUP'`.
5. El listener filtra por `origin.endsWith('.facebook.com')` y tipo `FINISH` / `CANCEL`.
6. En `FINISH` se llama a `POST /onboarding/exchange` con el `code`, `wabaId` y `phoneNumberId`.
7. **El frontend nunca ve el access token de larga duración**; el backend hace el token exchange.

## Arquitectura

```
src/app/
├── core/
│   ├── errors/          # AppError (union discriminada) + userFacingMessage
│   ├── http/            # authInterceptor (placeholder), errorInterceptor, loggingInterceptor, mockInterceptor
│   ├── logger/          # LoggerService con ConsoleSink (pluggable para Datadog/NewRelic)
│   ├── meta/            # FacebookSdkService + tipos del FB JS SDK + tipos Embedded Signup
│   └── tenant/          # TenantContextService (placeholder multi-tenant)
├── features/
│   ├── whatsapp-connect/  # WhatsappConnect + WhatsappOnboardingService + tipos
│   ├── wabas/             # WabasList + WabasService + tipos
│   └── events/            # EventsViewer + EventsService + EventsTransport (polling actual, SSE futuro)
└── app.{ts,html,css,config.ts,routes.ts}
```

### Extensiones previstas (sin implementar):

| Fase | Qué hacer |
|---|---|
| Auth (Cognito/Auth0) | Implementar `authInterceptor` + `auth.guard.ts` |
| Multi-tenant real | Resolver `tenantId` en `TenantContextService` desde subdominio/path/JWT |
| SSE / WebSocket | Crear `EventsSseTransport` que implemente `EventsTransport` y registrarlo en providers de `EventsViewer` |
| Observabilidad | Añadir `DatadogSink` / `NewRelicSink` que implemente `LogSink` y registrarlo en `LoggerService` |
| i18n | Activar `@angular/localize`, añadir atributos `i18n` en plantillas y ejecutar `npm run extract-i18n` |

## Accesibilidad

- Botones de acción con `aria-label` explícitos.
- Estados de carga con `aria-live="polite"` y `aria-busy="true"`.
- Errores bloqueantes con `aria-live="assertive"`.
- Tablas con `scope="col"` en cabeceras y `aria-label` descriptivo.
- Navegación con `role="banner"` / `role="main"`.
