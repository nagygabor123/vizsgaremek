import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const query = `
    SELECT 
        s.student_id,
        s.full_name,
        t.day_of_week,
        MIN(t.start_time) AS first_class_start,
        MAX(t.end_time) AS last_class_end
    FROM 
        students s
    JOIN 
        student_groups sg ON s.student_id = sg.student_id
    JOIN 
        groups g ON sg.group_id = g.group_id
    JOIN 
        timetables t ON g.group_id = t.group_id
    WHERE 
        t.day_of_week = 'monday'
    GROUP BY 
        s.student_id, s.full_name, t.day_of_week
    ORDER BY 
        s.student_id, t.day_of_week;
  `;

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(query);

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: "No timetable found for Monday." });
    }

    res.status(200).json({ students: rows });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: 'Database error occurred' });
  }
}
