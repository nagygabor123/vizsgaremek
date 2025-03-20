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
      const rows = await sql('SELECT status FROM lockers WHERE locker_id = $1', [lockerId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Szekrény nem található' });
      }

      const currentStatus = rows[0].status;
      const newStatus = currentStatus === 'be' ? 'ki' : 'be';
      const { rowCount: lockerUpdateCount } = await sql(
        'UPDATE lockers SET status = $1 WHERE locker_id = $2',
        [newStatus, lockerId]
      );

      if (lockerUpdateCount === 0) {
        return res.status(500).json({ message: 'Sikertelen szekrény státusz frissítés' });
      }

      const { rows: relationshipRows } = await sql(
        'SELECT rfid_tag FROM locker_relationships WHERE locker_id = $1',
        [lockerId]
      );

      if (relationshipRows.length === 0) {
        return res.status(404).json({ message: 'Nincs társított diák ehhez a szekrényhez' });
      }

      const rfidTag = relationshipRows[0].rfid_tag;
      const { rowCount: studentUpdateCount } = await sql(
        'UPDATE students SET access = $1 WHERE rfid_tag = $2',
        ['zarva', rfidTag]
      );

      if (studentUpdateCount === 0) {
        return res.status(500).json({ message: 'Sikertelen diák access frissítés' });
      }

      res.status(200).json({
        message: `Szekrény ${lockerId} státusza frissítve '${newStatus}'-re, és a diák access mezője frissítve 'zarva' értékre.`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  } else {
    res.status(405).json({ message: 'A módszer nem engedélyezett' });
  }
}