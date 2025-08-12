import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.DATABASE_URL!); // "process.env.DATABASE_URL!" é a url do banco de dados
