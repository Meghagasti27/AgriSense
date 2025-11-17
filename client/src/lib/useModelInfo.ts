// React hook for fetching ML model information
import { useState, useEffect } from 'react';
import { getModelInfo, ApiClientError } from './api-client';
import type { ModelInfo } from './api-types';

interface UseModelInfoReturn {
  data: ModelInfo | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom React hook for fetching ML model information
 * Automatically fetches on mount
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useModelInfo();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * if (data) return <div>Model: {data.model_type}</div>;
 * ```
 */
export function useModelInfo(): UseModelInfoReturn {
  const [data, setData] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModelInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getModelInfo();
      setData(result);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.detail);
      } else {
        setError('Failed to fetch model information');
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch model info on component mount
  useEffect(() => {
    fetchModelInfo();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchModelInfo,
  };
}
