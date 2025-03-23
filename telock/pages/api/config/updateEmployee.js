import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { admin_id, full_name, position, osztalyfonok } = req.body;

    if (!admin_id || !full_name || !position || !osztalyfonok) {
      return res.status(400).json({ message: 'Hiányzó kötelező mezők' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
      await sql(
        'UPDATE admins SET full_name = $1, position = $2, osztalyfonok = $3 WHERE admin_id = $4',
        [full_name, position, osztalyfonok, admin_id] 
      );
      res.status(200).json({ message: 'Sikeres frissítés' });
    } catch (error) {
      res.status(500).json({ message: 'Hiba a frissítés során', error: error.message });
    } 
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}

