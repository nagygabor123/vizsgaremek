
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { id } = req.query;
    const lockerId = parseInt(id);
    if (isNaN(lockerId) || lockerId < 1 || lockerId > 99) {
      return res.status(400).json({ message: 'Érvénytelen szekrény Id' });
    }

    try {
      const [rows] = await sql('SELECT status FROM lockers WHERE locker_id = $1', [lockerId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Szekrény nem található' });
      }

      const currentStatus = rows[0].status;
      const newStatus = currentStatus === 'be' ? 'ki' : 'be';
      const [result] = await sql(
        'UPDATE lockers SET status = ? WHERE locker_id = $1',
        [newStatus, lockerId]
      );

      if (result.affectedRows === 0) {
        return res.status(500).json({ message: 'Sikertelen szekrény státusz frissités' });
      }

      res.status(200).json({ message: `Szekrény ${lockerId} státusza frissítve '${newStatus}' (-re)` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Szerver hiba' });
    } 
  } else {
    res.status(405).json({ message: 'A módszer nem engedélyezett' });
  }
}
