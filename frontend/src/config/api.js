/**
 * Central API configuration for Élora.
 * Automatically switches between local dev (http://127.0.0.1:8000)
 * and production cloud backend (via VITE_API_BASE_URL set in Vercel).
 */
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)) ||
  'http://127.0.0.1:8000';
