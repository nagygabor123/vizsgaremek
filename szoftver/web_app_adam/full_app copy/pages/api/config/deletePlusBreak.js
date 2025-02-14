import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { year_schedule_id } = req.query;

    if (!year_schedule_id) {
      return res.status(400).json({ error: 'Hiányzó ID paraméter.' });
    }

    if (year_schedule_id === '1' || year_schedule_id === '2') {
      return res.status(400).json({ error: 'Az ID értéke nem lehet 1 vagy 2.' });
    }

    try {
      const connection = await connectToDatabase(); 
      const [record] = await connection.execute('SELECT * FROM year_schedule WHERE year_schedule_id = ?', [year_schedule_id]);
      
      if (record.length === 0) {
        return res.status(404).json({ error: 'Nem található rekord ezzel az ID-val.' });
      }
      const [result] = await connection.execute('DELETE FROM year_schedule WHERE year_schedule_id= ?', [year_schedule_id]);

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Sikeres törlés', deletedId: year_schedule_id });
      } else {
        return res.status(500).json({ error: 'Nem sikerült törölni a rekordot.' });
      }
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    }
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}
