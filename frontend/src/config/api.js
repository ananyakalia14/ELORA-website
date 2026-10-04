/**
 * Central API configuration for Élora.
 * In development, uses empty string so requests go through the Vite proxy (avoids CORS).
 * In production, uses the VITE_API_BASE_URL or VITE_API_URL env variable,
 * or falls back to the Railway backend deployment URL.
 */
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

const envUrl =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)) ||
  '';

const defaultProdUrl = 'https://elora-website-production.up.railway.app';

export const API_BASE_URL = isDev
  ? ''
  : (envUrl ? envUrl.replace(/\/+$/, '') : defaultProdUrl);

