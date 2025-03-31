import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { school_id } = req.query;

    if (!school_id) {
      return res.status(400).json({ error: 'Iskola aznosító szükséges' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        const rows = await sql(`SELECT school_name FROM students WHERE school_id = ${school_id}`);

      if (rows.length > 0) {
       // const access = rows[0].access;
        return res.status(200).json({ message: 'Sikeres lekérdezés', data: rows });
      } else {
        return res.status(404).json({ error: 'Iskola nem található' });
      }
    } catch (error) {
      console.error('Adatbazis hiba:', error);
      return res.status(500).json({ error: 'Hiba az adatok lekérdezésekor' });
    } 
  } else {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }
}
