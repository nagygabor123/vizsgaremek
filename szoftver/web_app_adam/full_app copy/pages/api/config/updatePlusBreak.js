import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, nev, which_day, replace_day } = req.body;

    if (!id || !nev || !which_day || !replace_day) {
      return res.status(400).json({ error: 'Id, nev, which_day és replace_day paraméterek szükségesek' });
    }

    if (id === 1 || id === 2) {
      return res.status(400).json({ error: 'Az 1-es és 2-es id nem frissíthető' });
    }

    try {
      const connection = await connectToDatabase();
      
      let query = 'UPDATE year_schedule SET nev = ?, which_day = ?, replace_day = ? WHERE year_schedule_id = ?';
      let values = [nev, which_day, replace_day, id];

      const [result] = await connection.execute(query, values);

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Sikeres frissítés', updatedId: id, updatedNev: nev, updatedDate: which_day, updatedReplaceDay: replace_day });
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
