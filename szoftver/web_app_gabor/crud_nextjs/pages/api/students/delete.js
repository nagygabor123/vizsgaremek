// pages/api/students/delete.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ message: 'Missing student_id' });
    }

    const db = await connectToDatabase();

    try {
      await db.execute('DELETE FROM students WHERE student_id = ?', [student_id]);
      res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
