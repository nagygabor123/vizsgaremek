import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const query = `
    SELECT 
        s.student_id, 
        s.full_name, 
        MIN(t.start_time) AS first_class_start, 
        MAX(t.end_time) AS last_class_end 
    FROM students s 
    JOIN (
        SELECT student_id, TRIM(SPLIT_PART(s.class, ',', n.n)) AS class_group 
        FROM students s 
        JOIN (
            SELECT 1 AS n 
            UNION ALL SELECT 2 
            UNION ALL SELECT 3 
            UNION ALL SELECT 4 
            UNION ALL SELECT 5 
            UNION ALL SELECT 6 
            UNION ALL SELECT 7
        ) n ON array_length(string_to_array(s.class, ','), 1) >= n.n 
    ) AS split_classes ON s.student_id = split_classes.student_id 
    JOIN csoportok c ON split_classes.class_group = c.group_name 
    JOIN group_relations gr ON c.group_id = gr.group_id 
    JOIN timetables t ON gr.timetable_id = t.timetable_id 
    WHERE t.day_of_week = LOWER(TRIM(TO_CHAR(CURRENT_DATE, 'Day'))) 
    GROUP BY s.student_id, s.full_name;
  `;

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const rows = await sql(query);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Nincs tanóra a mai nap!" });
    }

    res.status(200).json({ students: rows });

  } catch (error) {
    console.error("Hiba az adatok lekérdezésekor.:", error);
    res.status(500).json({ error: 'Hiba az adatok lekérdezésekor.' });
  }
}