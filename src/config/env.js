import 'dotenv/config';
import { z } from 'zod';

// Validar las variables de entorno
const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.string().transform(Number).default('3000'),
  MONGO_URL: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (parsed.success === false) {
  console.error('Invalid environment variables!', parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
