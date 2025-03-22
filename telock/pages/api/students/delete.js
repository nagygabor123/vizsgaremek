import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ message: 'Missing student_id' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
      // Lekérdezzük a diák RFID tag-jét
      const student = await sql('SELECT rfid_tag FROM students WHERE student_id = $1', [student_id]);

      if (student.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const rfidTag = student[0].rfid_tag;

      // Töröljük a kapcsolódó rekordokat a locker_relationships táblából
      await sql('DELETE FROM locker_relationships WHERE rfid_tag = $1', [rfidTag]);

      // Töröljük a diákot a students táblából
      await sql('DELETE FROM students WHERE student_id = $1', [student_id]);

      res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
