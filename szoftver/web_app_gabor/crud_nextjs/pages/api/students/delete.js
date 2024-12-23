import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ message: 'Missing student_id' });
    }

    const db = await connectToDatabase();

    try {
      // Get RFID tag of the student
      const result = await db.query('SELECT rfid_tag FROM students WHERE student_id = $1', [student_id]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const rfidTag = result.rows[0].rfid_tag;

      // Delete related records in locker_relationships
      await db.query('DELETE FROM locker_relationships WHERE rfid_tag = $1', [rfidTag]);

      // Delete the student
      await db.query('DELETE FROM students WHERE student_id = $1', [student_id]);

      res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ message: 'Error deleting student', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
