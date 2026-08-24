export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const APP_CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  defaultPageSize: 10,
} as const;

export const STORAGE_KEYS = {
  authToken: '@auth_token',
  userInfo: '@user_info',
  theme: '@theme',
} as const;
