import { z } from 'zod';

export const AddFavoriteSchema = z.object({
  imdbID: z.string().min(5, 'imdbID es requerido'),
});