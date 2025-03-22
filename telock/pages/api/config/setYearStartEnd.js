import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, which_day } = req.body;

    if (!type || !which_day) {
      return res.status(400).json({ error: 'Type és date paraméter szükséges' });
    }

    if (type !== 'kezd' && type !== 'veg') {
      return res.status(400).json({ error: 'Csak a kezd és veg típus frissíthető' });
    }

    try {
      // Connect to the Neon database
      const sql = neon(`${process.env.DATABASE_URL}`);

      // Update the record in the database
      const query = 'UPDATE year_schedule SET which_day = $1 WHERE type = $2';
      const values = [which_day, type];

      const result = await sql(query, values);

      if (result.rowCount > 0) {
        return res.status(200).json({ message: 'Sikeres frissítés', updatedType: type, updatedDate: which_day });
      } else {
        return res.status(404).json({ error: 'Nem található a megfelelő rekord' });
      }
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    }
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}