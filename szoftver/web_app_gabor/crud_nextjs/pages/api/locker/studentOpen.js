import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    try {
      // Adatbázis kapcsolat létrehozása
      const connection = await connectToDatabase();

      // Frissítés: az adott diák "access" mezőjének módosítása "nyitva" értékre
      const [result] = await connection.execute(
        'UPDATE students SET access = ? WHERE student_id = ?',
        ['nyitva', student_id]
      );

      // Ellenőrizzük, hogy történt-e változás
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Locker opened successfully' });
      } else {
        return res.status(404).json({ error: 'Student not found' });
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}