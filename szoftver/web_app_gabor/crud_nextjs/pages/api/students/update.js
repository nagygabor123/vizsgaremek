// pages/api/students/update.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { student_id, full_name, class: studentClass, rfid_tag } = req.body;

    if (!student_id || !full_name || !studentClass || !rfid_tag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();
    try {
      await db.execute(
        'UPDATE students SET full_name = ?, class = ?, rfid_tag = ? WHERE student_id = ?',
        [full_name, studentClass, rfid_tag, student_id]
      );
      res.status(200).json({ message: 'Student updated' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating student' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}