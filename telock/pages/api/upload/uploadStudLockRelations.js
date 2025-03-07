import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      // Lekérdezzük az összes diákot, akiknek van RFID tag-je
      const students = await sql('SELECT rfid_tag FROM students WHERE rfid_tag IS NOT NULL');
      const studentCount = students.length;

      if (studentCount === 0) {
        return res.status(400).json({ message: 'No students with RFID tags found' });
      }

      // Megkeressük a legnagyobb locker_id-t
      const maxLocker = await sql('SELECT MAX(locker_id) AS max_id FROM lockers');
      let nextLockerId = maxLocker[0].max_id ? maxLocker[0].max_id + 1 : 8;

      // Létrehozzuk a locker értékeket
      const lockerValues = Array.from({ length: studentCount }, (_, i) => [nextLockerId + i, 'ki']);
      await sql('INSERT INTO lockers (locker_id, status) VALUES ' + lockerValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', '), lockerValues.flat());

      // Létrehozzuk a kapcsolati értékeket
      const relationshipValues = students.map((student, index) => [student.rfid_tag, nextLockerId + index]);
      await sql('INSERT INTO locker_relationships (rfid_tag, locker_id) VALUES ' + relationshipValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', '), relationshipValues.flat());

      res.status(201).json({ 
        message: 'Lockers and relationships created successfully',
        lockersInserted: studentCount,
        relationshipsInserted: studentCount
      });
    } catch (error) {
      console.error('Error processing lockers:', error);
      res.status(500).json({ message: 'Error processing lockers', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}