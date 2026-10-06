import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

describe('GET /api/upgrades', () => {
  it('lists the 16 seed upgrades', async () => {
    const res = await request(createApp()).get('/api/upgrades');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(16);
    expect(res.body).toContainEqual(
      expect.objectContaining({
        id: 'intern',
        category: 'people',
        baseCost: 15,
        locPerSecond: 0.1,
        clickPower: 0,
      }),
    );
  });

  it('filters by category', async () => {
    const res = await request(createApp()).get('/api/upgrades?category=infra');
    expect(res.body).toHaveLength(3);
  });
});
