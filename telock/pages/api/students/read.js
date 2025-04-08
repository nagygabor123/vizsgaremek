import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { school_id } = req.query;
    console.log(school_id);
    const sql = neon(process.env.DATABASE_URL);

    try {
      const query = `
        SELECT 
          students.*, 
          lockers.status AS status
        FROM 
          students
        LEFT JOIN 
          locker_relationships ON students.rfid_tag = locker_relationships.rfid_tag
        LEFT JOIN 
          lockers ON locker_relationships.locker_id = lockers.locker_id
        WHERE 
          students.school_id = $1
      `;

      const students = await sql(query, [school_id]);

      if (students.length === 0) {
        return res.status(200).json([]);
      }


      res.status(200).json(students);
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      res.status(500).json({ message: 'Hiba az adatok lekérésénél', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}
