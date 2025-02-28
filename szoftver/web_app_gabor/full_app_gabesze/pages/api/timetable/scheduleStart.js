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
  const { student } = req.query;

  if (!student) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const query = `
    SELECT 
        s.student_id,
        s.full_name,
        t.day_of_week,
        MIN(t.start_time) AS first_class_start,
        MAX(t.end_time) AS last_class_end
    FROM 
        students s
    JOIN 
        timetables t 
        ON EXISTS (
            SELECT 1 
            FROM (SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(s.class, ',', n.n), ',', -1)) AS class_part
                  FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) n
                  WHERE n.n <= 1 + LENGTH(s.class) - LENGTH(REPLACE(s.class, ',', ''))
            ) AS student_classes
            JOIN (SELECT TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(t.\`group\`, ',', n.n), ',', -1)) AS group_part
                  FROM (SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5) n
                  WHERE n.n <= 1 + LENGTH(t.\`group\`) - LENGTH(REPLACE(t.\`group\`, ',', ''))
            ) AS timetable_groups
            ON student_classes.class_part = timetable_groups.group_part
        )
    WHERE 
        s.student_id = ?
        AND t.day_of_week = LOWER(DAYNAME(CURDATE()))
    GROUP BY 
        s.student_id, s.full_name, t.day_of_week
    ORDER BY 
        t.day_of_week;
  `;

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(query, [student]);

    await connection.end();

    if (rows.length === 0) {
      return res.status(404).json({ error: "No timetable found for the student on today's date." });
    }

    res.status(200).json(rows[0]);

  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: 'Database error occurred' });
  }
}
