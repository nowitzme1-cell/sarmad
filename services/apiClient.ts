
import { API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';

export const processData = async (payload: string): Promise<ApiResponse> => {
  const response = await fetch(API_ENDPOINTS.PROCESS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to process request: ${response.statusText}`);
  }

  return response.json();
};

export const triggerWorkflow = async (): Promise<ApiResponse> => {
  const response = await fetch(API_ENDPOINTS.TRIGGER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Workflow trigger failed: ${response.statusText}`);
  }

  return response.json();
};
