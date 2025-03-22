// pages/api/timetable/admin.js
/**
 * @swagger
 * /api/timetable/getTeacherTimetable:
 *   get:
 *     summary: Tanári órarend lekérése
 *     description: A GET kérés lekéri a megadott tanár órarendi adatait a napok és időpontok szerint, csoportok és diákok számára.
 *     tags:
 *       - Timetable
 *     responses:
 *       200:
 *         description: A tanár órarendi adatainak sikeres lekérése.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day_of_week:
 *                     type: string
 *                     description: A hét napja (pl. Hetfo).
 *                     example: "Hetfo"
 *                   start_time:
 *                     type: string
 *                     description: Az óra kezdési ideje.
 *                     example: "07:15:00"
 *                   end_time:
 *                     type: string
 *                     description: Az óra befejezési ideje.
 *                     example: "08:00:00"
 *                   group_name:
 *                     type: string
 *                     description: A csoport neve.
 *                     example: "13.I Physics"
 *                   teacher_name:
 *                     type: string
 *                     description: A tanár neve.
 *                     example: "nagy"
 *                   class:
 *                     type: string
 *                     description: A diák osztálya.
 *                     example: "13.I"
 *       500:
 *         description: Hiba történt az adatbázis kapcsolat során.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 *       405:
 *         description: Az adott HTTP metódus nem engedélyezett (nem GET kérés).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Method Not Allowed"
 */
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { teacherName } = req.query; 

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
