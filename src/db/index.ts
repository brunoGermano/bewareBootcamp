import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

// importing all the configs to create my db, importing like "schema" name. afterall my "db" variable created here will know which schema we use to create our postgresql data base
import * as schema from "./schema";
export const db = drizzle(process.env.DATABASE_URL!, { schema }); // "process.env.DATABASE_URL!" é a url do banco de dados
