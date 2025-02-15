// pages/api/timetable/scheduleStart.js
/**
 * @swagger
 * /api/timetable/scheduleStart:
 *   get:
 *     summary: Diák napi órarendjének első és utolsó órájának lekérése
 *     description: A GET kérés lekéri a megadott diák mai napi órarendjét, és visszaadja az első és utolsó óra kezdési és befejezési időpontját.
 *     parameters:
 *       - in: query
 *         name: student
 *         required: true
 *         description: A diák egyedi azonosítója (student_id), amelyet a kérésben query paraméterként kell megadni.
 *         schema:
 *           type: string
 *           enum: [OM11111, OM22222, OM33333, OM44444]
 *     tags:
 *       - Timetable
 *     responses:
 *       200:
 *         description: A diák mai napi órarendjének sikeres lekérése, tartalmazza az első és utolsó óra kezdési és befejezési idejét.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_id:
 *                   type: string
 *                   description: A diák egyedi azonosítója.
 *                   example: "OM44444"
 *                 full_name:
 *                   type: string
 *                   description: A diák teljes neve.
 *                   example: "Kovács János"
 *                 day_of_week:
 *                   type: string
 *                   description: A hét napja (pl. Hetfo).
 *                   example: "Hetfo"
 *                 first_class_start:
 *                   type: string
 *                   description: Az első óra kezdési ideje.
 *                   example: "08:00:00"
 *                 last_class_end:
 *                   type: string
 *                   description: Az utolsó óra befejezési ideje.
 *                   example: "12:00:00"
 *       400:
 *         description: A diák azonosítója hiányzik a kérésből.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Student ID is required"
 *       404:
 *         description: Nincs órarend a diák számára a mai napon.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "No timetable found for the student on today's date."
 *       500:
 *         description: Hiba történt az adatbázis kapcsolat során.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error occurred"
 */

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
