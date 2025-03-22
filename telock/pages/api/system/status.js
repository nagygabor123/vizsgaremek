import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql('SELECT status FROM system_status WHERE id = 1');

      if (result.length === 0) {
        return res.status(404).json({ error: 'System status not found' });
      }

      return res.status(200).json({ status: result[0].status });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}