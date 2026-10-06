import express from 'express';
import { errorHandler, notFoundHandler } from './errors.js';
import { profileRouter } from './routes/profile.js';
import { saveRouter } from './routes/save.js';
import { upgradesRouter } from './routes/upgrades.js';
import { wishlistRouter } from './routes/wishlist.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/upgrades', upgradesRouter);
  app.use('/api/save', saveRouter);
  app.use('/api/wishlist', wishlistRouter);
  app.use('/api/profile', profileRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
