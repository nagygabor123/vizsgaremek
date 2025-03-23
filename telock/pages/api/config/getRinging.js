import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const rows = await sql('SELECT start_time as "start", end_time as "end" FROM ring_times');
    const result = rows.map(row => ({
      start: row.start.slice(0, 5),  
      end: row.end.slice(0, 5)        
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error('Hiba a csengetési rend lekérdezésekor:', error);
    return res.status(500).json({ error: 'Hiba a csengetési rend lekérdezésekor' });
  }
}