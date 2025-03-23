import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { admin_id } = req.query;

    if (!admin_id) {
      return res.status(400).json({ error: 'Hiányzó ID paraméter.' });
    }

    if (admin_id === '1' ) { //|| admin_id === '2'
      return res.status(400).json({ error: 'Az ID értéke nem lehet 1.' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
      const record = await sql('SELECT * FROM admins WHERE admin_id = $1', [admin_id]);
      
      if (record.length === 0) {
        return res.status(404).json({ error: 'Nem található adminisztrátor ezzel az ID-val.' });
      }

      await sql('DELETE FROM admins WHERE admin_id = $1 ', [admin_id]);
      return res.status(200).json({ message: 'Sikeres törlés', deletedId: admin_id });
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Hiba a törlés során' });
    } 
  } else {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }
}
