// pages/api/timetable/admin.js
/**
 * @swagger
 * /api/timetable/admin:
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
    const teacherName = 'nagy'; // A tanár neve, amit keresünk

    try {
      // Csatlakozás az adatbázishoz
      const connection = await connectToDatabase();

      const [results] = await connection.execute(
        `SELECT DISTINCT
            tg.day_of_week, 
            tg.start_time, 
            tg.end_time, 
            \`groups\`.group_name, 
            a.full_name AS teacher_name, 
            s.class AS 'class'
          FROM 
            timetables tg
          JOIN 
            \`groups\` ON tg.group_id = \`groups\`.group_id
          JOIN 
            admins a ON tg.admin_id = a.admin_id
          JOIN 
            student_groups sg ON \`groups\`.group_id = sg.group_id
          JOIN 
            students s ON sg.student_id = s.student_id
          WHERE 
            a.full_name = ?
          ORDER BY 
            tg.day_of_week, tg.start_time;`,
        [teacherName]
      );

      // Visszaadjuk a lekérdezett adatokat
      return res.status(200).json(results);

    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    // Ha nem GET metódust használunk
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}