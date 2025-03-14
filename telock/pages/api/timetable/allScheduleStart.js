// import { connectToDatabase } from '../../../lib/db';

// export default async function handler(req, res) {
//   const query = `
// SELECT 
//     s.student_id, 
//     s.full_name, 
//     MIN(t.start_time) AS first_class_start, 
//     MAX(t.end_time) AS last_class_end 
// FROM students s 
// JOIN (
//     SELECT student_id, TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(s.class, ',', n.n), ',', -1)) AS class_group 
//     FROM students s 
//     JOIN (
//         SELECT 1 AS n 
//         UNION ALL SELECT 2 
//         UNION ALL SELECT 3 
//         UNION ALL SELECT 4 
//         UNION ALL SELECT 5 
//         UNION ALL SELECT 6 
//         UNION ALL SELECT 7
//     ) n ON CHAR_LENGTH(s.class) - CHAR_LENGTH(REPLACE(s.class, ',', '')) >= n.n - 1 
// ) AS split_classes ON s.student_id = split_classes.student_id 
// JOIN csoportok c ON split_classes.class_group = c.group_name 
// JOIN group_relations gr ON c.group_id = gr.group_id 
// JOIN timetables t ON gr.timetable_id = t.timetable_id 
// WHERE t.day_of_week = LOWER(DAYNAME(CURDATE())) 
// GROUP BY s.student_id, s.full_name;


//   `;

//   try {
//     const connection = await connectToDatabase();
//     const [rows] = await connection.execute(query);

//     await connection.end();

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "No timetable found for Monday." });
//     }

//     res.status(200).json({ students: rows });

//   } catch (error) {
//     console.error("Database error:", error);
//     res.status(500).json({ error: 'Database error occurred' });
//   }
// }
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
      return res.status(404).json({ error: "No timetable found for today." });
    }

    res.status(200).json({ students: rows });

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: 'Database error occurred' });
  }
}