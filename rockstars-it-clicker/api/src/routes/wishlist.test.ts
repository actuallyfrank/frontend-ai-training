import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { resetStore } from '../store.js';

describe('/api/wishlist', () => {
  beforeEach(() => resetStore());

  it('starts empty', async () => {
    const res = await request(createApp()).get('/api/wishlist');
    expect(res.body).toEqual({ upgradeIds: [] });
  });

  it('adds an upgrade', async () => {
    const res = await request(createApp()).post('/api/wishlist/rockstar');
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ upgradeIds: ['rockstar'] });
  });

  it('returns 404 for an unknown upgrade', async () => {
    const res = await request(createApp()).post('/api/wishlist/unicorn');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: { code: 'NOT_FOUND', message: expect.any(String) } });
  });

  it('adds the same upgrade only once', async () => {
    const app = createApp();
    await request(app).post('/api/wishlist/intern');
    const res = await request(app).post('/api/wishlist/intern');
    expect(res.body).toEqual({ upgradeIds: ['intern'] });
  });

  it('removes an upgrade', async () => {
    const app = createApp();
    await request(app).post('/api/wishlist/intern');
    const res = await request(app).delete('/api/wishlist/intern');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ upgradeIds: [] });
  });
});
