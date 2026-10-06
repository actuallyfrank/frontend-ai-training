import { renderHook, waitFor, act } from '@testing-library/react';
import { ApiError, apiClient } from './client';
import { useProfile } from './useProfile';

vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, apiClient: { get: vi.fn(), put: vi.fn(), post: vi.fn(), delete: vi.fn() } };
});

const profile = { companyName: 'Byte Me BV', avatar: '🥁', language: 'en' } as const;

describe('useProfile', () => {
  it('loads the profile', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(profile);
    const { result } = renderHook(() => useProfile());
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual(profile);
    expect(result.current.error).toBeNull();
  });

  it('exposes API errors', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new ApiError(500, 'INTERNAL_ERROR', 'Boom'));
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error?.code).toBe('INTERNAL_ERROR');
  });

  it('updates the profile', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(profile);
    const updated = { ...profile, companyName: 'Null Pointer Inc' };
    vi.mocked(apiClient.put).mockResolvedValue(updated);
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await act(() => result.current.update(updated));
    expect(apiClient.put).toHaveBeenCalledWith('/profile', updated);
    expect(result.current.data).toEqual(updated);
  });
});
