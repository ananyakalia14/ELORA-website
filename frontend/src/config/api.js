/**
 * Central API configuration for Élora.
 * Automatically targets local FastAPI dev server (http://127.0.0.1:8000) when running on localhost.
 * In production cloud deployment, supports same-origin relative (empty string), custom env URL,
 * or fallback to Railway production deployment.
 */
const _isLocalDev =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const defaultProdUrl = 'https://elora-website-production.up.railway.app';

function _resolveApiBase() {
  // 1. Check for Vite env vars
  const envUrl =
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL);

  if (envUrl) {
    // If the env var points to localhost/127.0.0.1 but we're NOT on localhost,
    // ignore it — it was baked in from a local .env file during build.
    const isLocalUrl = envUrl.includes('localhost') || envUrl.includes('127.0.0.1');
    if (isLocalUrl && !_isLocalDev) {
      return '';
    }
    return envUrl.replace(/\/+$/, '');
  }

  // 2. Fallback: localhost dev gets explicit backend URL, production gets same-origin
  return _isLocalDev ? 'http://127.0.0.1:8000' : '';
}

export const API_BASE_URL = _resolveApiBase();
