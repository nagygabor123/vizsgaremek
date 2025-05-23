import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'PUT') {

    const { id } = req.query;
    const lockerId = parseInt(id);
    const sql = neon(process.env.DATABASE_URL);

    if (!id) {
      return res.status(400).json({ error: 'locker_id szükséges' });
    }

    try {
      const rows = await sql('SELECT status FROM lockers WHERE locker_id = $1', [lockerId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Szekrény nem található' });
      }

      const currentStatus = rows[0].status;
      const newStatus = currentStatus === 'be' ? 'ki' : 'be';

      const rowCount = await sql(
        'UPDATE lockers SET status = $1 WHERE locker_id = $2',
        [newStatus, lockerId]
      );

      if (rowCount === 0) {
        return res.status(500).json({ message: 'Sikertelen szekrény státusz frissítés' });
      }

      const relationshipRows = await sql(
        'SELECT rfid_tag FROM locker_relationships WHERE locker_id = $1',
        [lockerId]
      );

      if (relationshipRows.length === 0) {
        return res.status(404).json({ message: 'Nincs társított diák ehhez a szekrényhez' });
      }

      const rfidTag = relationshipRows[0].rfid_tag;

      const studentRows = await sql(
        'SELECT access FROM students WHERE rfid_tag = $1',
        [rfidTag]
      );

      if (studentRows.length === 0) {
        return res.status(404).json({ message: 'Diák nem található ezzel az RFID-val' });
      }

      const studentAccess = studentRows[0].access;

      if (studentAccess === 'nyithato') {
        const updateResult = await sql(
          'UPDATE students SET access = $1 WHERE rfid_tag = $2',
          ['zarva', rfidTag]
        );

        if (updateResult === 0) {
          return res.status(500).json({ message: 'Sikertelen diák access frissítés' });
        }

        return res.status(200).json({
          message: `Szekrény ${lockerId} státusza '${newStatus}', diák hozzáférés 'zarva'-ra állítva.`,
        });
      } else {
        return res.status(200).json({
          message: `Szekrény ${lockerId} státusza '${newStatus}', diák hozzáférése változatlan maradt (${studentAccess}).`,
        });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hiba az adatok frissítésekor' });
    }
  } else {
    res.status(405).json({ message: 'A módszer nem engedélyezett' });
  }
}
