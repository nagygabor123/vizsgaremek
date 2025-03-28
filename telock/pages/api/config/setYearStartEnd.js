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
      const sql = neon(`${process.env.DATABASE_URL}`);
      const query = 'UPDATE year_schedule SET which_day = $1 WHERE type = $2';
      const values = [which_day, type];
      const result = await sql(query, values);
      return res.status(200).json({ message: 'Sikeres frissítés', updatedType: type, updatedDate: which_day });
    } catch (error) {
      console.error('Hiba a frissítés során:', error);
      return res.status(500).json({ error: 'Hiba a frissítés során' });
    }
  } else {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }
}