export const environment = {
  production: false,
  useMockBackend: true,
  api: {
    baseUrl: 'https://sggy86nf5k.execute-api.eu-west-1.amazonaws.com',
  },
  meta: {
    appId: '',
    sdkVersion: 'v19.0',
    configId: '',
  },
  tenant: {
    defaultTenantId: 'mapfre',
  },
  redirectUri: '',
};

export type Environment = typeof environment;
