// pages/api/timetable/admin.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const teacherName = 'nagy'; // A tanár neve, amit keresünk

    try {
      // Csatlakozás az adatbázishoz
      const connection = await connectToDatabase();

      // Az SQL lekérdezés
      const [results] = await connection.execute(
        `SELECT 
          tg.day_of_week, 
          tg.start_time, 
          tg.end_time, 
          g.group_name, 
          a.full_name AS teacher_name
        FROM 
          timetables tg
        JOIN 
          groups g ON tg.group_id = g.group_id
        JOIN 
          admins a ON tg.admin_id = a.admin_id
        WHERE 
          a.full_name = ?
        ORDER BY 
          tg.day_of_week, tg.start_time;`,
        [teacherName] // Paraméterként átadjuk a tanár nevét
      );

      // Visszaadjuk a lekérdezett adatokat
      return res.status(200).json(results);

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    // Ha nem GET metódust használunk
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
