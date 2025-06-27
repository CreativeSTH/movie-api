import { z } from 'zod';

export const RateFavoriteSchema = z.object({
  imdbID: z.string(),
  rating: z.number().min(1).max(10),
  comment: z.string().max(300).optional(),
});