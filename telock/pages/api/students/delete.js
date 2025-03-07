/**
 * @swagger
 * /api/students/delete:
 *   delete:
 *     summary: Diák törlése
 *     description: A diák törlésére szolgáló API végpont, amely eltávolítja a diákot és a hozzá kapcsolódó adatokat a rendszerből.
 *     tags:
 *       - Students
 *     requestBody:
 *       description: A diák törléséhez szükséges adatok.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 description: A törlendő diák azonosítója.
 *                 example: "OM56555"
 *     responses:
 *       200:
 *         description: Sikeres törlés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student deleted"
 *       400:
 *         description: Hiányzó student_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing student_id"
 *       404:
 *         description: A diák nem található
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
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
 *       500:
 *         description: Hiba történt a diák törlése során
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting student"
 *                 error:
 *                   type: string
 *                   example: "Database error details"
 */
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ message: 'Missing student_id' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
      // Lekérdezzük a diák RFID tag-jét
      const student = await sql('SELECT rfid_tag FROM students WHERE student_id = $1', [student_id]);

      if (student.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const rfidTag = student[0].rfid_tag;

      // Töröljük a kapcsolódó rekordokat a locker_relationships táblából
      await sql('DELETE FROM locker_relationships WHERE rfid_tag = $1', [rfidTag]);

      // Töröljük a diákot a students táblából
      await sql('DELETE FROM students WHERE student_id = $1', [student_id]);

      res.status(200).json({ message: 'Student deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting student', error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
