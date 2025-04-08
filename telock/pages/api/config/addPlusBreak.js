import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, nev, which_day, replace_day, school_id } = req.body;

    if (!type || !nev || !which_day || !replace_day || !school_id) {
      return res.status(400).json({ error: 'Hiányzó paraméterek.' });
    }

    if (type !== 'szunet' && type !== 'plusznap' && type !== 'tanitasnelkul') {
      return res.status(400).json({ error: 'Csak a szünetet illetve a plusznapokat lehet feltölteni' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      const query = 'INSERT INTO year_schedule (type, nev, which_day, replace_day, school_id) VALUES ($1, $2, $3, $4, $5);';
      const values = [type, nev, which_day, replace_day, school_id];
      await sql(query, values);
      return res.status(200).json({ message: 'Sikeres frissítés', updatedType: type, updatedDate: which_day });
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Hiba a hozzáadás során' });
    }
  } else {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }
}