import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak a POST metódus használható' });
  }

  try {
    const { ringing } = req.body;

    if (!Array.isArray(ringing) || ringing.length === 0) {
      return res.status(400).json({ error: 'A ringing tömb üres vagy hibás' });
    }

    const db = await connectToDatabase();
    const insertQuery = 'INSERT INTO ring_times (`start_time`, `end_time`) VALUES (?, ?)';

    for (const { start_time, end_time } of ringing) {
      if (!start_time || !end_time) {
        console.warn('Hiányzó adatok:', { start_time, end_time });
        continue; // Hibás sort kihagy
      }

      try {
        await db.execute(insertQuery, [start_time, end_time]);
      } catch (dbError) {
        console.error(`Hiba az adatbázisba íráskor: ${dbError.message}`);
        return res.status(500).json({ error: 'Adatbázis hiba a feltöltés közben.' });
      }
    }

    await db.end(); // Kapcsolat lezárása
    return res.status(200).json({ message: 'Csengetési rend sikeresen feltöltve!' });
  } catch (error) {
    console.error('Hiba a kérés feldolgozása közben:', error);
    return res.status(500).json({ error: 'Hiba a kérés feldolgozása közben' });
  }
}
