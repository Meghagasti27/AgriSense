// ML API Client for AgriSense
import type {
  CropInput,
  RecommendResponse,
  ModelInfo,
  ApiError,
} from './api-types';

// API base URL - picks from env, falls back to localhost
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'http://localhost:8000';

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  statusCode: number;
  detail: string;

  constructor(statusCode: number, detail: string) {
    super(detail);
    this.statusCode = statusCode;
    this.detail = detail;
    this.name = 'ApiClientError';
  }
}




/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  token: string | null,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options?.headers || {}),
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      const errorData: ApiError = await response
        .json()
        .catch(() => ({ detail: 'An unknown error occurred' }));
      throw new ApiClientError(response.status, errorData.detail);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(
      500,
      'Network error: Unable to connect to server'
    );
  }
}

/**
 * Get crop recommendations based on soil and weather data
 */
export async function getCropRecommendations(
  input: CropInput,
  token: string | null
): Promise<RecommendResponse> {
  console.log('Crop input being sent to API:', input);
  return apiRequest<RecommendResponse>('/api/recommend', token, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Get ML model information and metrics
 */
export async function getModelInfo(
  token: string | null = null
): Promise<ModelInfo> {
  return apiRequest<ModelInfo>('/api/model-info', token);
}

/**
 * Helper to check if API is reachable
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    });
    return res.ok;
  } catch {
    return false;
  }
}
