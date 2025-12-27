/**
 * Backend URL derived from environment variables or default local development.
 * Uses Vite-style environment variable access as seen in the application entry point.
 */
const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL || 'http://localhost:3000';

/**
 * API Endpoints used throughout the application for modular services.
 */
export const API_ENDPOINTS = {
  PROCESS: `${BACKEND_URL}/api/process`,
  TRIGGER: `${BACKEND_URL}/n8n/trigger`,
};
