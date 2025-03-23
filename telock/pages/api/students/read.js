import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const sql = neon(process.env.DATABASE_URL);
    try {
      const students = await sql(
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
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      res.status(500).json({ message: 'Hiba az adatok lekérésénél', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}
