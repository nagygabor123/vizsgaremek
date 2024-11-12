// pages/api/users/create.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();

    try {
      await db.execute('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age]);
      res.status(201).json({ message: 'User created' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
