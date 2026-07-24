export const environment = {
  production: true,
  useMockBackend: false,

  api: {
    baseUrl: 'https://api.your-domain.com',
  },

  meta: {
    appId: 'YOUR_META_APP_ID',
    sdkVersion: 'v21.0',
    configId: 'YOUR_EMBEDDED_SIGNUP_CONFIG_ID',
  },

  tenant: {
    defaultTenantId: 'mapfre',
  },
};

export type Environment = typeof environment;
