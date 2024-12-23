import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase();

    try {
      // SQL lekérdezés a students, locker_relationships és lockers táblák összevonására
      const { rows: students } = await db.query(`
        SELECT 
          students.*, 
          lockers.status AS status
        FROM 
          students
        LEFT JOIN 
          locker_relationships ON students.rfid_tag = locker_relationships.rfid_tag
        LEFT JOIN 
          lockers ON locker_relationships.locker_id = lockers.locker_id
      `);

      // Válasz visszaküldése
      res.status(200).json(students);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error fetching students data' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
