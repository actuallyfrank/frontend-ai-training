import { useCallback, useEffect, useState } from 'react';
import { ApiError, apiClient } from './client';
import type { Profile } from './types';

export function useProfile() {
  const [data, setData] = useState<Profile | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiClient
      .get<Profile>('/profile')
      .then((profile) => {
        if (!cancelled) setData(profile);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof ApiError ? err : new ApiError(0, 'UNKNOWN_ERROR', String(err)));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback(async (profile: Profile) => {
    const saved = await apiClient.put<Profile>('/profile', profile);
    setData(saved);
    return saved;
  }, []);

  return { data, error, isLoading, update };
}
