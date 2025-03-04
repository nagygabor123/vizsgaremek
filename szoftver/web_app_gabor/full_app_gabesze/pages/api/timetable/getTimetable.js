
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const teacherName = 'PaZo'; 

    let connection;

    try {
      connection = await connectToDatabase();

      const [results] = await connection.execute(
        `    
          SELECT 
              t.day_of_week,
              t.start_time,
              t.end_time,
              GROUP_CONCAT(c.group_name ORDER BY c.group_name SEPARATOR ', ') AS class,
              t.group_name AS group_name,
              a.short_name AS teacher_name
          FROM 
              timetables t
          JOIN 
              group_relations gr ON t.timetable_id = gr.timetable_id
          JOIN 
              csoportok c ON gr.group_id = c.group_id  
          JOIN 
              admins a ON t.admin_id = a.admin_id
          WHERE 
              a.short_name = ?
          GROUP BY 
              t.day_of_week, t.start_time, t.end_time, t.group_name, a.short_name
          ORDER BY 
              FIELD(t.day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
              t.start_time;
        `,
        [teacherName]
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
