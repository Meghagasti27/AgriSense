// ML API Client for AgriSense
import type { CropInput, RecommendResponse, ModelInfo, ApiError } from './api-types';

// API base URL - change based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Custom error class for API errors
 */
export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public detail: string
  ) {
    super(detail);
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
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        detail: 'An unknown error occurred',
      }));
      throw new ApiClientError(response.status, errorData.detail);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(500, 'Network error: Unable to connect to server');
  }
}

/**
 * Get crop recommendations based on soil and weather data
 */
export async function getCropRecommendations(
  input: CropInput,
  token: string | null
): Promise<RecommendResponse> {
  console.log("Token in API Client:", input);
  return apiRequest<RecommendResponse>('/api/recommend', token, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/**
 * Get ML model information and metrics
 */
export async function getModelInfo(token: string | null): Promise<ModelInfo> {
  return apiRequest<ModelInfo>('/api/model-info', token);
}

/**
 * Helper to check if API is reachable
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    return true;
  } catch {
    return false;
  }
}