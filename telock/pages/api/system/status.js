import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { school_id } = req.query;
      console.log(school_id);
      const sql = neon(process.env.DATABASE_URL);
      const result = await sql(`SELECT status FROM schools WHERE school_id = ${school_id}`);

      if (result.length === 0) {
        return res.status(404).json({ error: 'A rendszer státusza nem található' });
      }

      return res.status(200).json({ status: result[0].status });
    } catch (error) {
      console.error('Hiba az adatok lekérdezésekor:', error);
      return res.status(500).json({ error: 'Hiba az adatok lekérdezésekor' });
    }
  } else {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett.' });
  }
}