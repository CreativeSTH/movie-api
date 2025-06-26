import { z } from 'zod';

export const ResendVerificationDto = z.object({
  email: z.string().email({ message: 'Email inválido' }),
});
