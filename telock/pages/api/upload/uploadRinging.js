import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }

  try {
    const { school_id } = req.query;
    console.log(school_id);
    const { ringing } = req.body;
    console.log(ringing);

    if (!school_id || !Array.isArray(ringing) || ringing.length === 0) {
      return res.status(400).json({ error: 'A ringing tömb üres vagy hibás' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const insertQuery = 'INSERT INTO ring_times (start_time, end_time,school_id) VALUES ($1, $2, $3)';

    for (const { start_time, end_time } of ringing) {
      if (!start_time || !end_time) {
        console.warn('Hiányzó adatok:', { start_time, end_time });
        continue; // Hibás sort kihagy
      }

      try {
        await sql(insertQuery, [start_time, end_time, school_id]);
      } catch (dbError) {
        console.error(`Hiba az adatbázisba íráskor: ${dbError.message}`);
        return res.status(500).json({ error: 'Hiba az adatok feltöltésekor' });
      }
    }

    return res.status(200).json({ message: 'Csengetési rend sikeresen feltöltve!' });
  } catch (error) {
    console.error('Hiba a kérés feldolgozása közben:', error);
    return res.status(500).json({ error: 'Hiba az adatok feltöltésekor' });
  }
}