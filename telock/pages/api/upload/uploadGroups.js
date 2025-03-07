import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { groups } = req.body;

    if (!Array.isArray(groups) || groups.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty groups array' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
      const insertPromises = groups.map(group => 
        sql('INSERT INTO csoportok (group_name) VALUES ($1)', [group.name])
      );

      await Promise.all(insertPromises);

      res.status(201).json({ message: 'Groups uploaded successfully' });
    } catch (error) {
      console.error('Error uploading groups:', error);
      res.status(500).json({ message: 'Error uploading groups', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}