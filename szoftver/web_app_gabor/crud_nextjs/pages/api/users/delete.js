// pages/api/users/delete.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    const db = await connectToDatabase();

    try {
      await db.execute('DELETE FROM users WHERE id = ?', [id]);
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
