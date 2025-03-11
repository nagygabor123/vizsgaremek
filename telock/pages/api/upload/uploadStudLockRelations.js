import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      // Lekérjük az összes diákot, akiknek van RFID tag-je
      const students = await sql('SELECT rfid_tag FROM students WHERE rfid_tag IS NOT NULL');
      const studentCount = students.length;

      if (studentCount === 0) {
        return res.status(400).json({ message: 'No students with RFID tags found' });
      }

      // Lekérjük a legnagyobb locker_id-t
      const maxLocker = await sql('SELECT MAX(locker_id) AS max_id FROM lockers');
      let nextLockerId = maxLocker[0]?.max_id ? maxLocker[0].max_id + 1 : 8;

      // Létrehozzuk a locker rekordokat
      const lockerValues = Array.from({ length: studentCount }, (_, i) => [nextLockerId + i, 'ki']);
      await sql(
        'INSERT INTO lockers (locker_id, status) SELECT * FROM UNNEST($1::int[], $2::text[])',
        [lockerValues.map(lv => lv[0]), lockerValues.map(lv => lv[1])]
      );

      // Létrehozzuk a kapcsolati rekordokat
      const relationshipValues = students.map((student, index) => [student.rfid_tag, nextLockerId + index]);
      await sql(
        'INSERT INTO locker_relationships (rfid_tag, locker_id) SELECT * FROM UNNEST($1::text[], $2::int[])',
        [relationshipValues.map(rv => rv[0]), relationshipValues.map(rv => rv[1])]
      );

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