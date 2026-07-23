import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

declare global {
  interface Window {
    FB?: {
      init: (config: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (
        callback: (response: { authResponse?: { code?: string } | null; status?: string }) => void,
        params: Record<string, unknown>,
      ) => void;
    };
    fbAsyncInit?: () => void;
  }
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  appId = environment.metaAppId;
  configId = environment.configId;
  redirectUri = environment.redirectUri;
  clientId = environment.clientId;
  apiUrl = environment.apiUrl;
  codeInput = '';

  sdkReady = false;
  logs: Array<{ text: string; type: 'info' | 'ok' | 'warn' }> = [];

  constructor() {
    this.loadSaved();
    this.log('Listo. Rellena campos y ejecuta paso 1 -> 2 -> 3.', 'info');

    window.addEventListener('message', (event: MessageEvent) => {
      if (!event.data) {
        return;
      }
      const data = typeof event.data === 'string' ? event.data : JSON.stringify(event.data);
      this.log(`message event: ${data}`, 'info');
    });
  }

  initSdk(): void {
    this.saveCurrent();

    if (!this.appId.trim()) {
      this.log('Falta META_APP_ID', 'warn');
      return;
    }

    if (window.FB) {
      window.FB.init({
        appId: this.appId.trim(),
        cookie: true,
        xfbml: false,
        version: 'v19.0',
      });
      this.sdkReady = true;
      this.log('SDK inicializado.', 'ok');
      return;
    }

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: this.appId.trim(),
        cookie: true,
        xfbml: false,
        version: 'v19.0',
      });
      this.sdkReady = true;
      this.log('SDK inicializado.', 'ok');
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
  }

  launchSignup(): void {
    this.saveCurrent();

    if (!this.appId.trim() || !this.configId.trim() || !this.redirectUri.trim()) {
      this.log('Faltan META_APP_ID, Config ID o Redirect URI.', 'warn');
      return;
    }

    if (!this.sdkReady || !window.FB) {
      this.log('Inicializa SDK primero.', 'warn');
      return;
    }

    this.log('Lanzando Embedded Signup...', 'ok');

    window.FB.login(
      (response) => {
        const code = response?.authResponse?.code;
        if (code) {
          this.codeInput = code;
          this.log('Code capturado desde authResponse.code', 'ok');
          return;
        }

        this.log(`Respuesta FB.login sin code: ${JSON.stringify(response)}`, 'info');
        this.log('Si no aparece code, revisa callback.html y URL final.', 'warn');
      },
      {
        config_id: this.configId.trim(),
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          feature: 'whatsapp_embedded_signup',
          sessionInfoVersion: 3,
        },
        auth_type: 'rerequest',
        redirect_uri: this.redirectUri.trim(),
      },
    );
  }

  async exchangeCode(): Promise<void> {
    const code = this.codeInput.trim();
    const clientId = this.clientId.trim() || 'mapfre';
    const apiUrl = this.apiUrl.trim();

    if (!code) {
      this.log('Falta code para exchange.', 'warn');
      return;
    }

    if (!apiUrl) {
      this.log('Falta API URL.', 'warn');
      return;
    }

    const url = `${apiUrl}/onboarding/exchange`;
    this.log(`POST ${url}`, 'info');

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, client_id: clientId }),
      });

      const text = await res.text();
      this.log(`HTTP ${res.status} -> ${text}`, res.ok ? 'ok' : 'warn');
    } catch (err) {
      this.log(`Error llamando backend: ${String(err)}`, 'warn');
    }
  }

  private loadSaved(): void {
    const mapping: Array<[keyof App, string]> = [
      ['appId', 'es_appId'],
      ['configId', 'es_configId'],
      ['redirectUri', 'es_redirectUri'],
      ['clientId', 'es_clientId'],
      ['apiUrl', 'es_apiUrl'],
    ];

    for (const [field, storageKey] of mapping) {
      const value = localStorage.getItem(storageKey);
      if (value) {
        this[field] = value as never;
      }
    }
  }

  private saveCurrent(): void {
    localStorage.setItem('es_appId', this.appId.trim());
    localStorage.setItem('es_configId', this.configId.trim());
    localStorage.setItem('es_redirectUri', this.redirectUri.trim());
    localStorage.setItem('es_clientId', this.clientId.trim());
    localStorage.setItem('es_apiUrl', this.apiUrl.trim());
  }

  private log(message: string, type: 'info' | 'ok' | 'warn'): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push({ text: `[${timestamp}] ${message}`, type });
  }
}
