import { ApiError, apiClient } from './client';

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, statusText: 'OK', ...response });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('apiClient', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('prefixes paths with /api and parses JSON', async () => {
    const fetchMock = mockFetch({ json: async () => ({ hello: 'world' }) });
    await expect(apiClient.get('/profile')).resolves.toEqual({ hello: 'world' });
    expect(fetchMock).toHaveBeenCalledWith('/api/profile', expect.objectContaining({ method: 'GET' }));
  });

  it('sends JSON bodies', async () => {
    const fetchMock = mockFetch({ status: 204 });
    await apiClient.put('/save', { loc: 1 });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/save',
      expect.objectContaining({ method: 'PUT', body: '{"loc":1}' }),
    );
  });

  it('maps error responses to ApiError', async () => {
    mockFetch({
      ok: false,
      status: 404,
      json: async () => ({ error: { code: 'NOT_FOUND', message: 'Unknown upgrade' } }),
    });
    await expect(apiClient.post('/wishlist/unicorn')).rejects.toEqual(
      new ApiError(404, 'NOT_FOUND', 'Unknown upgrade'),
    );
  });

  it('maps network failures to ApiError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    await expect(apiClient.get('/save')).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });
});
