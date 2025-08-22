import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.url(),
  FRONTEND_URL: z.url(),
});

export const env = envSchema.parse(process.env);
