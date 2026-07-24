export const environment = {
  production: true,
  useMockBackend: false,

  api: {
    baseUrl: 'https://sggy86nf5k.execute-api.eu-west-1.amazonaws.com',
  },

  meta: {
    appId: '864793622627809',
    sdkVersion: 'v21.0',
    configId: '1209692291296285',
  },

  tenant: {
    defaultTenantId: 'mapfre',
  },
};

export type Environment = typeof environment;
