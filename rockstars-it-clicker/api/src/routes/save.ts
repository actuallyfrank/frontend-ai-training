import { Router } from 'express';
import { validationError } from '../errors.js';
import { saveGameSchema } from '../schemas/save.js';
import { getSaveGame, storeSaveGame } from '../services/save.js';

export const saveRouter = Router();

saveRouter.get('/', (_req, res) => {
  res.json(getSaveGame());
});

saveRouter.put('/', (req, res) => {
  const result = saveGameSchema.safeParse(req.body);
  if (!result.success) throw validationError(result.error);
  storeSaveGame(result.data);
  res.status(204).end();
});
