
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const teacherName = 'KiGI'; 

    let connection;

    try {
      connection = await connectToDatabase();

      const [results] = await connection.execute(
        `        SELECT t.day_of_week, t.start_time, t.end_time, t.group AS class,t.group_name, a.short_name AS teacher_name FROM timetables t JOIN admins a ON t.admin_id = a.admin_id WHERE a.short_name LIKE ? ORDER BY FIELD(t.day_of_week, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday');`,
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
