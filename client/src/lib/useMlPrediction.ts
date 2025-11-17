// React hook for ML crop prediction
import { useState } from 'react';
import { getCropRecommendations, ApiClientError } from './api-client';
import type { CropInput, RecommendResponse } from './api-types';

interface UseMlPredictionReturn {
  predict: (input: CropInput, token: string) => Promise<void>;
  data: RecommendResponse | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

/**
 * Custom React hook for getting ML crop predictions
 * 
 * @example
 * ```tsx
 * const { predict, data, loading, error } = useMlPrediction();
 * 
 * const handleSubmit = async (formData) => {
 *   await predict(formData);
 * };
 * ```
 */
export function useMlPrediction(): UseMlPredictionReturn {
  const [data, setData] = useState<RecommendResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predict = async (input: CropInput, token:string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCropRecommendations(input,token);
      setData(result);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail);
      } else {
        setError('An unexpected error occurred');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return {
    predict,
    data,
    loading,
    error,
    reset,
  };
}
