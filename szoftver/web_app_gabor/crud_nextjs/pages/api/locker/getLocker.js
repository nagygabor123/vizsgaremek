// pages/api/locker/getLocker.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rfid } = req.query;  // Az RFID-t a kérés paramétereként kapjuk

    if (!rfid) {
      return res.status(400).json({ error: 'RFID is required' });
    }

    try {
      // Csatlakozás az adatbázishoz
      const connection = await connectToDatabase();

      // Kérdezzük le a locker_relationships táblát az RFID alapján
      const [lockerRelationship] = await connection.execute(
        'SELECT locker_id FROM locker_relationships WHERE rfid_tag = ?',
        [rfid]
      );

      // Ha nem találunk kapcsolatot, akkor hibát adunk vissza
      if (lockerRelationship.length === 0) {
        return res.status(404).json({ error: 'No locker found for this RFID' });
      }

      const lockerId = lockerRelationship[0].locker_id;

      // Kérdezzük le a locker táblát a locker_id alapján
      const [locker] = await connection.execute(
        'SELECT * FROM lockers WHERE locker_id = ?',
        [lockerId]
      );

      // Ha nem találunk ilyen szekrényt, hibát adunk vissza
      if (locker.length === 0) {
        return res.status(404).json({ error: 'Locker not found' });
      }

      // Visszaadjuk a szekrény státuszát
      return res.status(200).send(locker[0].locker_id.toString());
      //return res.status(200).send("AA");

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
