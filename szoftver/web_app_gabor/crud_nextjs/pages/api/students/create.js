// pages/api/students/create.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { student_id, full_name, class: studentClass, rfid_tag } = req.body;

    if (!student_id || !full_name || !studentClass || !rfid_tag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();

    try {
      await db.execute('INSERT INTO students (student_id, full_name, class, rfid_tag) VALUES (?, ?, ?, ?)', [student_id, full_name, studentClass, rfid_tag]);
      res.status(201).json({ message: 'Student created' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating student' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}