// pages/api/users/update.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { id, name, email, age } = req.body;

    if (!id || !name || !email || !age) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();

    try {
      await db.execute(
        'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
        [name, email, age, id]
      );
      res.status(200).json({ message: 'User updated' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
