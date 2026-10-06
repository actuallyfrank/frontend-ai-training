import { z } from 'zod';

export const avatars = ['🎸', '🥁', '🎤', '🎹'] as const;

export const profileSchema = z.object({
  companyName: z.string().trim().min(2).max(40),
  avatar: z.enum(avatars),
  language: z.enum(['en', 'nl']),
});

export type Profile = z.infer<typeof profileSchema>;
