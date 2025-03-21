import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { teacherName } = req.query;

    try {
      // Connect to the Neon database
      const sql = neon(`${process.env.DATABASE_URL}`);

      // Execute the query
      const results = await sql(
        `    
          SELECT 
              t.day_of_week,
              t.start_time,
              t.end_time,
              STRING_AGG(c.group_name, ', ' ORDER BY c.group_name) AS class,
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
              a.short_name = $1
          GROUP BY 
              t.day_of_week, t.start_time, t.end_time, t.group_name, a.short_name
          ORDER BY 
              CASE t.day_of_week
                  WHEN 'monday' THEN 1
                  WHEN 'tuesday' THEN 2
                  WHEN 'wednesday' THEN 3
                  WHEN 'thursday' THEN 4
                  WHEN 'friday' THEN 5
                  WHEN 'saturday' THEN 6
                  WHEN 'sunday' THEN 7
              END,
              t.start_time;
        `,
        [teacherName]
      );

      return res.status(200).json(results);

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}