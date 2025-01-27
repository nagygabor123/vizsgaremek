// pages/api/students/read.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase();

    // SQL query to join students, locker_relationships, and lockers tables
    const [students] = await db.execute(
      `SELECT 
        students.*, 
        lockers.status AS status
      FROM 
        students
      LEFT JOIN 
        locker_relationships ON students.rfid_tag = locker_relationships.rfid_tag
      LEFT JOIN 
        lockers ON locker_relationships.locker_id = lockers.locker_id`
    );

    res.status(200).json(students);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}