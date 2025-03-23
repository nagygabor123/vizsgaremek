import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      const students = await sql('SELECT rfid_tag FROM students WHERE rfid_tag IS NOT NULL');
      const studentCount = students.length;

      if (studentCount === 0) {
        return res.status(400).json({ message: 'Nem találtak RFID-címkével rendelkező diákokat' });
      }

      const maxLocker = await sql('SELECT MAX(locker_id) AS max_id FROM lockers');
      let nextLockerId = maxLocker[0]?.max_id ? maxLocker[0].max_id + 1 : 8;
      const lockerValues = Array.from({ length: studentCount }, (_, i) => [nextLockerId + i, 'ki']);
      await sql(
        'INSERT INTO lockers (locker_id, status) SELECT * FROM UNNEST($1::int[], $2::text[])',
        [lockerValues.map(lv => lv[0]), lockerValues.map(lv => lv[1])]
      );

      const relationshipValues = students.map((student, index) => [student.rfid_tag, nextLockerId + index]);
      await sql(
        'INSERT INTO locker_relationships (rfid_tag, locker_id) SELECT * FROM UNNEST($1::text[], $2::int[])',
        [relationshipValues.map(rv => rv[0]), relationshipValues.map(rv => rv[1])]
      );

      res.status(201).json({ 
        message: 'Diák-szekrény kapcsolatok sikeresen feltöltve', 
        lockersInserted: studentCount,
        relationshipsInserted: studentCount
      });
    } catch (error) {
      console.error('Hiba az adatok feltöltésekor:', error);
      res.status(500).json({ message: 'Hiba az adatok feltöltésekor', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}