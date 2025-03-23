import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { className } = req.query; 
    if (!className) {
      return res.status(400).json({ error: 'Missing class name parameter' });
    }

    let connection;
    try {
      connection = await connectToDatabase();

      const [results] = await connection.execute(
        `SELECT DISTINCT
              t.day_of_week,
              r.start_time,
              r.end_time,
              c.group_name,
              a.short_name AS teacher_name
          FROM timetables t
          JOIN group_relations gr ON t.timetable_id = gr.timetable_id
          JOIN csoportok c ON gr.group_id = c.group_id
          JOIN student_groups sg ON sg.group_id = c.group_id
          JOIN students s ON s.student_id = sg.student_id
          JOIN admins a ON t.admin_id = a.admin_id
          JOIN ring_times r ON t.start_time = r.start_time  
          WHERE FIND_IN_SET(?, s.class) > 0
          GROUP BY 
              t.day_of_week, r.start_time, r.end_time, c.group_name, a.short_name
          ORDER BY 
              FIELD(t.day_of_week,'monday', 'tuesday', 'wednesday', 'thursday', 'friday'),
              r.start_time;`,
        [className]
      );

      return res.status(200).json(results);
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}