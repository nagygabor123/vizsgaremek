import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { groups } = req.body;
    
    if (!Array.isArray(groups) || groups.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty groups array' });
    }

    const db = await connectToDatabase();

    try {
      const insertValues = groups.map(group => [group.name]);
      
      await db.query(
        'INSERT INTO csoportok (group_name) VALUES ?;',
        [insertValues]
      );

      res.status(201).json({ message: 'Groups uploaded successfully' });
    } catch (error) {
      console.error('Error uploading groups:', error);
      res.status(500).json({ message: 'Error uploading groups', error: error.message });
    } finally {
      await db.end();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
