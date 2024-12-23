import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const teacherName = 'nagy'; // A tanár neve, amit keresünk

    try {
      // Csatlakozás az adatbázishoz
      const pool = await connectToDatabase();

      // Az SQL lekérdezés
      const { rows } = await pool.query(
        `SELECT DISTINCT
          tg.day_of_week, 
          tg.start_time, 
          tg.end_time, 
          g.group_name, 
          a.full_name AS teacher_name, 
          s.class AS "class"
        FROM 
          timetables tg
        JOIN 
          groups g ON tg.group_id = g.group_id
        JOIN 
          admins a ON tg.admin_id = a.admin_id
        JOIN 
          student_groups sg ON g.group_id = sg.group_id  -- Csatlakozás a student_groups táblához
        JOIN 
          students s ON sg.student_id = s.student_id  -- Csatlakozás a students táblához
        WHERE 
          a.full_name = $1
        ORDER BY 
          tg.day_of_week, tg.start_time;`,
        [teacherName] // Paraméterként átadjuk a tanár nevét
      );

      // Visszaadjuk a lekérdezett adatokat
      return res.status(200).json(rows);

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    // Ha nem GET metódust használunk
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
