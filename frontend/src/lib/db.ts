import { Pool } from "pg";

declare global {
  var __asmynePool: Pool | undefined;
}

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing. Add it to your server environment.");
  }

  const db =
    global.__asmynePool ??
    new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
    });

  if (process.env.NODE_ENV !== "production") {
    global.__asmynePool = db;
  }

  return db;
}
