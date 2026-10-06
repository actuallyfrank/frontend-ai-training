import { Router } from 'express';
import { validationError } from '../errors.js';
import { profileSchema } from '../schemas/profile.js';
import { getProfile, updateProfile } from '../services/profile.js';

export const profileRouter = Router();

profileRouter.get('/', (_req, res) => {
  res.json(getProfile());
});

profileRouter.put('/', (req, res) => {
  const result = profileSchema.safeParse(req.body);
  if (!result.success) throw validationError(result.error);
  res.json(updateProfile(result.data));
});
