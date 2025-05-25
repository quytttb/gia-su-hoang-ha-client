/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USE_MOCK_DATA: string;
  readonly VITE_GOOGLE_MAPS_API_KEY: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_CONTACT_PHONE: string;
  readonly VITE_CONTACT_EMAIL: string;
  readonly VITE_ENABLE_RATE_LIMITING: string;
  readonly VITE_MAX_REQUESTS_PER_MINUTE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
