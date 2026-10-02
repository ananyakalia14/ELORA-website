/**
 * Central API configuration for Élora.
 * Automatically targets local FastAPI dev server (http://127.0.0.1:8000) when running on localhost.
 * In production cloud deployment, uses VITE_API_BASE_URL if configured, or falls back to client sanctuary mode.
 */
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL)) ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8000'
    : '');

