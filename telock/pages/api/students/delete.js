import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ message: 'Hiányzó student_id' });
    }

    const sql = neon(process.env.DATABASE_URL);
    try {
      const student = await sql('SELECT rfid_tag FROM students WHERE student_id = $1', [student_id]);
      if (student.length === 0) {
        return res.status(404).json({ message: 'A diák nem található' });
      }

      const rfidTag = student[0].rfid_tag;
      await sql('DELETE FROM locker_relationships WHERE rfid_tag = $1', [rfidTag]);
      await sql('DELETE FROM students WHERE student_id = $1', [student_id]);

      res.status(200).json({ message: 'Sikeres törlés' });
    } catch (error) {
      res.status(500).json({ message: '	Hiba történt a diák törlése során', error });
    }
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}
