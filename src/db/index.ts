import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

if(!process.env.DATABASE_URL){
  throw new Error("DATABASE URL must be configured.")
}

export const db = drizzle(process.env.DATABASE_URL);
