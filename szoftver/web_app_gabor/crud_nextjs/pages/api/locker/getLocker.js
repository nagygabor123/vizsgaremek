/**
 * @swagger
 * /api/locker/getLocker:
 *   get:
 *     summary: Lekéri a szekrény azonosítóját egy adott RFID alapján
 *     description: Megnézi, hogy a megadott RFID-hoz tartozik-e diák és szekrény. Ha a diák nyithatja a szekrényt, visszaadja az azonosítót.
 *     parameters:
 *       - in: query
 *         name: rfid
 *         required: true
 *         description: A diák RFID azonosítója
 *         schema:
 *           type: string
 *           example: "F7F59C7A"
 *     tags:
 *       - Locker
 *     responses:
 *       200:
 *         description: A diák szekrényének azonosítója vagy "zarva" / "nincs" állapot
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *       400:
 *         description: Az RFID paraméter hiányzik
 *       404:
 *         description: Nem található szekrény ehhez az RFID-hoz
 *       500:
 *         description: Adatbázis kapcsolat hiba
 */
import { connectToDatabase } from '../../../lib/db';

async function getLockerByRFID(rfid, connection) {
  const [lockerRelationship] = await connection.execute(
    'SELECT locker_id FROM locker_relationships WHERE rfid_tag = ?',
    [rfid]
  );

  if (lockerRelationship.length === 0) {
    return { error: 'No locker found for this RFID', status: 404 };
  }

  const lockerId = lockerRelationship[0].locker_id;
  const [locker] = await connection.execute(
    'SELECT * FROM lockers WHERE locker_id = ?',
    [lockerId]
  );

  if (locker.length === 0) {
    return { error: 'Locker not found', status: 404 };
  }

  return { lockerId: locker[0].locker_id.toString(), status: 200 };
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rfid } = req.query;

    if (!rfid) {
      return res.status(400).json({ error: 'RFID is required' });
    }

    try {
      const connection = await connectToDatabase();

      const [student] = await connection.execute(
        'SELECT student_id,access FROM students WHERE rfid_tag = ?',
        [rfid]
      );

      if (student.length === 0) {
        return res.status(200).send("nincs");
      }

      const studentid = student[0].student_id;
      const studentaccess = student[0].access;

      // Lekérdezzük a diák órarendjét
      const scheduleResponse = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${studentid}`);
      if (!scheduleResponse.ok) {
        return res.status(500).json({ error: 'Failed to fetch schedule' });
      }

      const schedule = await scheduleResponse.json();
      const { first_class_start, last_class_end } = schedule;

      const currentTime = new Date().toTimeString().slice(0, 5); // HH:MM

      if (currentTime >= first_class_start && currentTime <= last_class_end) {
        if (studentaccess === "nyithato"){
          const lockerResult = await getLockerByRFID(rfid, connection);

          if (lockerResult.error) {
            return res.status(lockerResult.status).json({ error: lockerResult.error });
          }

          return res.status(200).send(lockerResult.lockerId);
        } else{
          return res.status(200).send("zarva");
        }
      } else {
        const lockerResult = await getLockerByRFID(rfid, connection);

        if (lockerResult.error) {
          return res.status(lockerResult.status).json({ error: lockerResult.error });
        }

        return res.status(200).send(lockerResult.lockerId);
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
