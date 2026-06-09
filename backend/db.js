import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,   // ✅ IMPORTANT
  ssl: {
    rejectUnauthorized: false                  // ✅ REQUIRED for Railway
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000               // ✅ increase timeout
});

export async function query(sql, params = []) {
  const { rows } = await pool.query(sql, params);
  return rows;
}
