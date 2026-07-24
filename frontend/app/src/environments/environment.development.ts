export const environment = {
  production: false,
  useMockBackend: true,

  api: {
    baseUrl: 'http://localhost:4200',
  },

  meta: {
    appId: 'YOUR_META_APP_ID_DEV',
    sdkVersion: 'v21.0',
    configId: 'YOUR_EMBEDDED_SIGNUP_CONFIG_ID_DEV',
  },

  tenant: {
    defaultTenantId: 'mapfre',
  },
};

export type Environment = typeof environment;
