// lib/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Kapcsolat-pool létrehozása
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,    // Várakozzon, ha nincs elérhető kapcsolat
  connectionLimit: 10,         // A maximális kapcsolatok száma
  queueLimit: 0                // Nincs várakozási limit
});

export async function connectToDatabase() {
  const connection = await pool.getConnection();
  return connection;
}




/* régi
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  return connection;
}*/
