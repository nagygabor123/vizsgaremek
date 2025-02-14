import { connectToDatabase } from '../../../lib/db';
import crypto from 'crypto';

function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString('hex');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { full_name, position } = req.body;

    if (!full_name || !position) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const password = generatePassword(); // Jelszó generálása

    const db = await connectToDatabase();

    try {
      await db.execute(
        'INSERT INTO admins (full_name, password, position) VALUES (?, ?, ?)',
        [full_name, password, position]
      );
      res.status(201).json({ message: 'Admin created', password }); // Visszaküldjük a generált jelszót
    } catch (error) {
      res.status(500).json({ message: 'Error creating admin' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
