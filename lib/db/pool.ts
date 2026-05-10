import { Pool } from "pg";

if (typeof window !== "undefined") {
  throw new Error("lib/db/pool.ts must not be imported on the client side");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
