// pages/api/timetable/scheduleStart.js

import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  const { student } = req.query; // lekérjük a 'student' query paramétert
  
  if (!student) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const query = `
    SELECT 
      s.student_id,
      s.full_name,
      tt.day_of_week,
      MIN(tt.start_time) AS first_class_start,
      MAX(tt.end_time) AS last_class_end
    FROM 
      students s
    JOIN 
      student_groups sg ON s.student_id = sg.student_id
    JOIN 
      \`groups\` g ON sg.group_id = g.group_id
    JOIN 
      timetables tt ON g.group_id = tt.group_id
    WHERE 
      s.student_id = ?  -- A diák azonosítóját paraméterként adjuk át
      AND tt.day_of_week = DAYNAME(CURDATE()) -- Csak a mai napot figyeljük
    GROUP BY 
      s.student_id, tt.day_of_week
    ORDER BY 
      MIN(tt.start_time);
  `;
  
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(query, [student]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No timetable found for the student on today\'s date.' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error occurred' });
  }
}
