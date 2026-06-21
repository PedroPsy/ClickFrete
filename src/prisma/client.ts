import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL não configurado. Verifique se o arquivo .env existe antes de iniciar a API.');
}

export const prisma = new PrismaClient({
  errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
});
