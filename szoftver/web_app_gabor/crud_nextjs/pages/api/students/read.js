/**
 * @swagger
 * /api/students/read:
 *   get:
 *     summary: Diákok lekérése
 *     description: A diákok adatainak lekérése, beleértve a hozzájuk rendelt szekrények státuszát is.
 *     tags:
 *       - Students
 *     responses:
 *       200:
 *         description: Sikeres lekérés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student_id:
 *                     type: string
 *                     description: A diák azonosítója.
 *                     example: "12345"
 *                   full_name:
 *                     type: string
 *                     description: A diák teljes neve.
 *                     example: "Kovács Gábor"
 *                   class:
 *                     type: string
 *                     description: A diák osztálya.
 *                     example: "12.A"
 *                   rfid_tag:
 *                     type: string
 *                     description: A diák RFID címkéje.
 *                     example: "abc123"
 *                   status:
 *                     type: string
 *                     description: A szekrény státusza (pl. elérhető, foglalt).
 *                     example: "elérhető"
 *       405:
 *         description: A HTTP metódus nem engedélyezett
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Method Not Allowed"
 */

import { connectToDatabase } from '../../../lib/db';


export default async function handler(req, res) {
  if (req.method === 'GET') {
    const db = await connectToDatabase();

    // SQL lekérdezés, amely összekapcsolja a diákokat, a szekrényhez rendelt kapcsolatokat és a szekrények státuszát
    const [students] = await db.execute(
      `SELECT 
        students.*, 
        lockers.status AS status
      FROM 
        students
      LEFT JOIN 
        locker_relationships ON students.rfid_tag = locker_relationships.rfid_tag
      LEFT JOIN 
        lockers ON locker_relationships.locker_id = lockers.locker_id`
    );

    res.status(200).json(students);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
