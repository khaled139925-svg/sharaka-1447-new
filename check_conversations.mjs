import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { conversations } from './drizzle/schema.ts';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('//')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'sharaka',
});

const db = drizzle(connection);
const result = await db.select().from(conversations);
console.log('عدد المحادثات:', result.length);
console.log('المحادثات:', result);
process.exit(0);
