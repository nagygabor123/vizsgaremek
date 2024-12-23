import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { student_id, full_name, class: studentClass, rfid_tag } = req.body;

    if (!student_id || !full_name || !studentClass || !rfid_tag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();

    try {
      // PostgreSQL lekérdezés paraméterekkel
      await db.query(
        'INSERT INTO students (student_id, full_name, class, rfid_tag, access) VALUES ($1, $2, $3, $4, $5)',
        [student_id, full_name, studentClass, rfid_tag, 'nyitva']
      );
      res.status(201).json({ message: 'Student created' });
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ message: 'Error creating student' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
