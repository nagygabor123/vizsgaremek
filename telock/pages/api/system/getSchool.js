import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }

  const { school_id } = req.query;

  if (!school_id) {
    return res.status(400).json({ error: 'Iskola aznosító szükséges' });
  }

  const id = parseInt(school_id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Érvénytelen iskola azonosító' });
  }

  try {
    const rows = await sql(`SELECT school_name FROM students WHERE school_id = ${id}`);

    if (rows.length > 0) {
      return res.status(200).json({ message: 'Sikeres lekérdezés', data: rows });
    } else {
      return res.status(404).json({ error: 'Iskola nem található' });
    }
  } catch (error) {
    console.error('Adatbázis hiba:', error);
    return res.status(500).json({ error: 'Hiba az adatok lekérdezésekor', details: error.message });
  }
}
