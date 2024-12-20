// pages/api/students/read.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase();
    const [users] = await db.execute('SELECT * FROM students');
    res.status(200).json(users);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
