import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rfid } = req.query;

    if (!rfid) {
      return res.status(400).json({ error: 'RFID is required' });
    }

    try {
      // Csatlakozás az adatbázishoz
      const pool = await connectToDatabase();

      // Lekérdezés a students táblából az "access" értékéért az RFID alapján
      const studentResult = await pool.query(
        'SELECT access FROM students WHERE rfid_tag = $1',
        [rfid]
      );

      // Ha nincs találat a students táblában
      if (studentResult.rows.length === 0) {
        return res.status(200).send("nincs");
      }

      const access = studentResult.rows[0].access;

      // Ellenőrizzük az access értéket
      if (access === 'zarva') {
        return res.status(200).send("zarva");
      } else if (access === 'nyitva') {
        // Lekérdezés a locker_relationships táblából
        const lockerRelationshipResult = await pool.query(
          'SELECT locker_id FROM locker_relationships WHERE rfid_tag = $1',
          [rfid]
        );

        if (lockerRelationshipResult.rows.length === 0) {
          return res.status(404).json({ error: 'No locker found for this RFID' });
        }

        const lockerId = lockerRelationshipResult.rows[0].locker_id;

        // Lekérdezés a lockers táblából
        const lockerResult = await pool.query(
          'SELECT * FROM lockers WHERE locker_id = $1',
          [lockerId]
        );

        if (lockerResult.rows.length === 0) {
          return res.status(404).json({ error: 'Locker not found' });
        }

        return res.status(200).send(lockerResult.rows[0].locker_id.toString());
      } else {
        return res.status(400).json({ error: 'Invalid access value' });
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
