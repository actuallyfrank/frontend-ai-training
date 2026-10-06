import { Router } from 'express';
import { addToWishlist, getWishlist, removeFromWishlist } from '../services/wishlist.js';

export const wishlistRouter = Router();

wishlistRouter.get('/', (_req, res) => {
  res.json({ upgradeIds: getWishlist() });
});

wishlistRouter.post('/:upgradeId', (req, res) => {
  res.status(201).json({ upgradeIds: addToWishlist(req.params.upgradeId) });
});

wishlistRouter.delete('/:upgradeId', (req, res) => {
  res.json({ upgradeIds: removeFromWishlist(req.params.upgradeId) });
});
