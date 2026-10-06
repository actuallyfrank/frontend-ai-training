import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { resetStore } from '../store.js';

describe('/api/save', () => {
  beforeEach(() => resetStore());

  it('returns a fresh savegame when nothing was saved', async () => {
    const res = await request(createApp()).get('/api/save');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      loc: 0,
      owned: {},
      totalLoc: 0,
      startedAt: expect.any(String),
    });
  });

  it('stores a valid savegame', async () => {
    const app = createApp();
    const save = { loc: 42, owned: { intern: 2 }, startedAt: new Date().toISOString(), totalLoc: 80 };
    const put = await request(app).put('/api/save').send(save);
    expect(put.status).toBe(204);
    const get = await request(app).get('/api/save');
    expect(get.body).toEqual(save);
  });

  it('rejects an invalid savegame', async () => {
    const res = await request(createApp())
      .put('/api/save')
      .send({ loc: -5, owned: {}, startedAt: new Date().toISOString(), totalLoc: 0 });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: { code: 'VALIDATION_ERROR', message: expect.any(String) } });
  });
});
