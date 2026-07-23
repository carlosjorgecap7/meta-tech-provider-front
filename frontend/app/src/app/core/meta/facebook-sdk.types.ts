/** Tipado mínimo del FB JS SDK que usamos. No pretende cubrir toda la API. */
export interface FbLoginOptions {
  config_id: string;
  response_type: 'code';
  override_default_response_type: true;
  extras: {
    setup: Record<string, unknown>;
    featureType: 'whatsapp_business_app_onboarding';
    sessionInfoVersion: '3';
  };
}

export interface FbAuthResponse {
  accessToken?: string;
  code?: string;
  expiresIn?: number;
  signedRequest?: string;
  userID?: string;
  grantedScopes?: string;
}

export interface FbLoginResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse?: FbAuthResponse;
}

export interface FbInitOptions {
  appId: string;
  version: string;
  xfbml: boolean;
  cookie: boolean;
}

export interface FbSDK {
  init(options: FbInitOptions): void;
  login(
    callback: (response: FbLoginResponse) => void,
    options: FbLoginOptions,
  ): void;
}

declare global {
  interface Window {
    FB?: FbSDK;
    fbAsyncInit?: () => void;
  }
}
