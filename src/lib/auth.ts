import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema,
  }),
  // We need inform to "auth.ts" that we renamed the standard tables that it was created before in the "auth-schema.ts" generation when installed the better-auth. The old names of the tables were "user, session, account", so:
  user: {
    modelName: "userTable", //new name to the constant variable which is exported from schema.ts
  },
  session: {
    modelName: "sessionTable", //new name to the constant variable which is exported from schema.ts
  },
  account: {
    modelName: "accountTable", //new name to the constant variable which is exported from schema.ts
  },
  verification: {
    modelName: "verificationTable", //new name to the constant variable which is exported from schema.ts
  },
});
