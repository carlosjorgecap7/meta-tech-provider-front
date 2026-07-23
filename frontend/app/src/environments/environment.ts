export const environment = {
  production: false,
  metaAppId: process.env['NG_APP_META_APP_ID'] || '',
  configId: process.env['NG_APP_CONFIG_ID'] || '',
  redirectUri: process.env['NG_APP_REDIRECT_URI'] || '',
  clientId: process.env['NG_APP_CLIENT_ID'] || '',
  apiUrl: process.env['NG_APP_API_URL'] || '',
};
