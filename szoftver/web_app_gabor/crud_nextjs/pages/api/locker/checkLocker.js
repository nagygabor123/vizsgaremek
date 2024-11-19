// pages/api/locker/checkLocker.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rfid } = req.query;

    if (!rfid) {
      return res.status(400).json({ error: 'RFID is required' });
    }

    try {
      // Adatbázis kapcsolat létrehozása
      const connection = await connectToDatabase();

      // Lekérdezés az RFID alapján
      const [rows] = await connection.execute('SELECT access FROM students WHERE rfid_tag = ?', [rfid]);

      // Ellenőrizzük, hogy van-e találat
      if (rows.length > 0) {
        const access = rows[0].access;
        return res.status(200).json(rows );
      } else {
        return res.status(404).json({ error: 'RFID not found' });
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
