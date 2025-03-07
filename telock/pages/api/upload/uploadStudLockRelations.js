import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToDatabase();

    try {
      const [students] = await db.query(`SELECT rfid_tag FROM students WHERE rfid_tag IS NOT NULL;`);
      const studentCount = students.length;

      if (studentCount === 0) {
        return res.status(400).json({ message: 'No students with RFID tags found' });
      }

      const [maxLocker] = await db.query(`SELECT MAX(locker_id) AS max_id FROM lockers;`);
      let nextLockerId = maxLocker[0].max_id ? maxLocker[0].max_id + 1 : 8;

      const lockerValues = Array.from({ length: studentCount }, (_, i) => [nextLockerId + i, 'ki']);
      await db.query(`INSERT INTO lockers (locker_id, status) VALUES ?;`, [lockerValues]);

      const relationshipValues = students.map((student, index) => [student.rfid_tag, nextLockerId + index]);
      await db.query(`INSERT INTO locker_relationships (rfid_tag, locker_id) VALUES ?;`, [relationshipValues]);

      res.status(201).json({ 
        message: 'Lockers and relationships created successfully',
        lockersInserted: studentCount,
        relationshipsInserted: studentCount
      });
    } catch (error) {
      console.error('Error processing lockers:', error);
      res.status(500).json({ message: 'Error processing lockers', error: error.message });
    } finally {
      await db.end();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
