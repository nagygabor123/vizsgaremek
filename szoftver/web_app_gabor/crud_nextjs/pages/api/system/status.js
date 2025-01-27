import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Csatlakozás az adatbázishoz
      const connection = await connectToDatabase();

      // Lekérdezés a system_status táblából az id = 1 státusz lekérésére
      const [rows] = await connection.execute('SELECT status FROM system_status WHERE id = 1');

      // Ha nem találunk rekordot, hibát adunk vissza
      if (rows.length === 0) {
        return res.status(404).json({ error: 'System status not found' });
      }

      // Visszaküldjük a státuszt
      return res.status(200).json({ status: rows[0].status });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}