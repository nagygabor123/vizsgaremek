// pages/api/users.js
import { connectToDatabase } from '../../lib/db';

export default async function handler(req, res) {
  const db = await connectToDatabase();

  if (req.method === 'GET') {
    const [users] = await db.execute('SELECT * FROM users');
    res.status(200).json(users);

  } else if (req.method === 'POST') {
    const { name, email, age } = req.body;
    await db.execute('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age]);
    res.status(201).json({ message: 'User created' });

  } else if (req.method === 'PUT') {
    const { id, name, email, age } = req.body;
    await db.execute('UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?', [name, email, age, id]);
    res.status(200).json({ message: 'User updated' });

  } else if (req.method === 'DELETE') {
    const { id } = req.body;
    await db.execute('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User deleted' });

  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
