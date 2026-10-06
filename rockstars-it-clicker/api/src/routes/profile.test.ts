import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { resetStore } from '../store.js';

describe('/api/profile', () => {
  beforeEach(() => resetStore());

  it('returns the default profile', async () => {
    const res = await request(createApp()).get('/api/profile');
    expect(res.body).toEqual({ companyName: 'Garage Startup', avatar: '🎸', language: 'en' });
  });

  it('stores a valid profile', async () => {
    const app = createApp();
    const profile = { companyName: 'Byte Me BV', avatar: '🥁', language: 'nl' };
    const put = await request(app).put('/api/profile').send(profile);
    expect(put.status).toBe(200);
    expect(put.body).toEqual(profile);
    const get = await request(app).get('/api/profile');
    expect(get.body).toEqual(profile);
  });

  it('rejects an unknown avatar', async () => {
    const res = await request(createApp())
      .put('/api/profile')
      .send({ companyName: 'Byte Me BV', avatar: '🦄', language: 'en' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects a company name that is too short', async () => {
    const res = await request(createApp())
      .put('/api/profile')
      .send({ companyName: 'X', avatar: '🎸', language: 'en' });
    expect(res.status).toBe(400);
  });
});
