import { z } from 'zod';

export const saveGameSchema = z.object({
  loc: z.number().nonnegative(),
  owned: z.record(z.string(), z.number().int().nonnegative()),
  startedAt: z.iso.datetime(),
  totalLoc: z.number().nonnegative(),
});

export type SaveGame = z.infer<typeof saveGameSchema>;
