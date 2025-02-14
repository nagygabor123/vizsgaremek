import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase();

    try {
      const [rows] = await db.execute('SELECT admin_id, full_name, position FROM admins');
      res.status(200).json(rows); // Visszaadjuk az alkalmazottak listáját
    } catch (error) {
      res.status(500).json({ message: 'Error fetching employees' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
