/**
 * Interface representing the structure of a standard API response.
 */
export interface ApiResponse {
  timestamp: string;
  data?: any;
  message?: string;
}

/**
 * Interface representing the state of an API request.
 */
export interface ApiState {
  data: ApiResponse | null;
  isLoading: boolean;
  error: string | null;
}
