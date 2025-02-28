
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const teacherName = 'KiGI'; 

    let connection;

    try {
      connection = await connectToDatabase();

      const [results] = await connection.execute(
        `SELECT 
            t.day_of_week,
            t.start_time,
            t.end_time,
            t.group_name,
            GROUP_CONCAT(g.group_name SEPARATOR ', ') AS \`group\`,
            a.short_name
        FROM 
            timetables t
        JOIN 
            groups g ON t.group_id = g.group_id
        JOIN 
            admins a ON t.admin_id = a.admin_id
        WHERE 
            a.short_name = ? 
        GROUP BY 
            t.day_of_week, t.start_time, t.end_time, t.group_name, a.short_name
        ORDER BY 
            FIELD(t.day_of_week, 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'), 
            t.start_time;`,
        [teacherName] // Paraméterként átadva a teacherName változó
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
