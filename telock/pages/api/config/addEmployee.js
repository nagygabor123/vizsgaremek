import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString('hex');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { full_name, position, osztalyfonok, short_name } = req.body;

    if (!full_name || !position || !osztalyfonok || !short_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const password = generatePassword();
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      const lastAdmin = await sql('SELECT MAX(admin_id) AS max_id FROM admins');
      let nextAdminId = 1; 
      if (lastAdmin[0].max_id !== null) {
        nextAdminId = lastAdmin[0].max_id + 1;
      }

      await sql(
        'INSERT INTO admins (admin_id, full_name, password, position, osztalyfonok, short_name) VALUES ($1, $2, $3, $4, $5, $6)',
        [nextAdminId, full_name, password, position, osztalyfonok, short_name]
      );

      res.status(201).json({ message: 'Admin created', password });
    } catch (error) {
      console.error('Error creating admin:', error);
      res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}