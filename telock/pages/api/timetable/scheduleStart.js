import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const { student } = req.query;
  if (!student) {
    return res.status(400).json({ error: 'Hiányzó "student_id"!' });
  }

  const query = `
    SELECT 
        s.student_id, 
        s.full_name, 
        MIN(t.start_time) AS first_class_start, 
        MAX(t.end_time) AS last_class_end 
    FROM students s 
    JOIN student_groups sg ON s.student_id = sg.student_id
    JOIN csoportok c ON sg.group_id = c.group_id
    JOIN group_relations gr ON c.group_id = gr.group_id 
    JOIN timetables t ON gr.timetable_id = t.timetable_id 
    WHERE s.student_id = $1
      AND t.day_of_week = Monday)
    GROUP BY s.student_id, s.full_name;
  `;

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const rows = await sql(query, [student]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Nincs tanóra a mai nap!" });
    }

    res.status(200).json(rows);

  } catch (error) {
    console.error("Hiba az adatok lekérdezésekor.:", error);
    res.status(500).json({ error: 'Hiba az adatok lekérdezésekor.' });
  }
}
