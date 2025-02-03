
/**
 * @swagger
 * /api/locker/getLocker:
 *   get:
 *     summary:  Megkeresi a diákhoz tartozó szekrényt az RFID alapján.
 *     description: Az RFID alapján megkeresi a diákot, majd ellenőrzi az órarendjét. Ha az órák tartanak, a szekrény zárva marad. Ha nincs óra, visszaadja a szekrény azonosítóját.
 *     parameters:
 *       - in: query
 *         name: rfid
 *         required: true
 *         description: Az RFID kártya azonosítója, amely alapján ellenőrizzük a hozzáférési státuszt.
 *         schema:
 *           type: string
 *           example: "F7F59C7A"
 *     tags:
 *       - Locker
 *     responses:
 *       200:
 *         description: Sikeres válasz, visszaadja a szekrény azonosítóját vagy hogy a szekrény zárva van.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Hiányzó RFID paraméter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Nem található diák vagy szekrény.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Adatbázis hiba vagy egyéb belső szerverhiba.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rfid } = req.query;

    if (!rfid) {
      return res.status(400).json({ error: 'RFID is required' });
    }

    try {
      const connection = await connectToDatabase();

      const [student] = await connection.execute(
        'SELECT student_id FROM students WHERE rfid_tag = ?',
        [rfid]
      );

      if (student.length === 0) {
        return res.status(200).send("nincs");
      }

      const studentid = student[0].student_id;

      // Lekérdezzük a diák órarendjét
      const scheduleResponse = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${studentid}`);
      if (!scheduleResponse.ok) {
        return res.status(500).json({ error: 'Failed to fetch schedule' });
      }

      const schedule = await scheduleResponse.json();
      const { first_class_start, last_class_end } = schedule;

      const currentTime = new Date().toTimeString().slice(0, 5); // HH:MM

      if (currentTime >= first_class_start && currentTime <= last_class_end) {
        return res.status(200).send("zarva");
      } else {
        const [lockerRelationship] = await connection.execute(
          'SELECT locker_id FROM locker_relationships WHERE rfid_tag = ?',
          [rfid]
        );

        if (lockerRelationship.length === 0) {
          return res.status(404).json({ error: 'No locker found for this RFID' });
        }

        const lockerId = lockerRelationship[0].locker_id;
        const [locker] = await connection.execute(
          'SELECT * FROM lockers WHERE locker_id = ?',
          [lockerId]
        );

        if (locker.length === 0) {
          return res.status(404).json({ error: 'Locker not found' });
        }

        return res.status(200).send(locker[0].locker_id.toString());
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
