import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { school_id } = req.query;
    
    if (!school_id) {
      return res.status(400).json({ message: 'school_id hiányzik' }); 
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
      const result = await sql('SELECT admin_id, full_name, short_name, position, osztalyfonok FROM admins WHERE school_id = $1', [school_id]);
      res.status(200).json(result);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error fetching employees' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
