import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '../.env' });

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'southernmaldives',
  port: parseInt(process.env.PGPORT || '5432'),
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('Running migration: add_vision_fields.sql');
    
    const sql = readFileSync('../migrations/add_vision_fields.sql', 'utf-8');
    
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    console.log('✅ Migration completed successfully');
    
    // Verify
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'app_1e21816bb9_hotels' 
      AND column_name IN ('vision_main_text', 'vision_italic_text')
    `);
    
    console.log('Verification - columns added:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });
    
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
