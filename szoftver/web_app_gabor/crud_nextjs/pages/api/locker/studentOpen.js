/**
 * @swagger
 * /api/locker/studentOpen:
 *   post:
 *     summary: Diák zárának kinyitása
 *     description: Frissíti a diák "access" mezőjét "nyitva" értékre, ezzel kinyitja a zárat.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 description: A diák egyedi azonosítója, amely a zár kinyitásához szükséges.
 *                 example: "OM11111"
 *     tags:
 *       - Locker
 *     responses:
 *       200:
 *         description: A zár sikeresen kinyílt.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Locker opened successfully"
 *       400:
 *         description: Ha a diák azonosítója nincs megadva.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Student ID is required"
 *       404:
 *         description: Ha a diák nem található az adatbázisban.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Student not found"
 *       500:
 *         description: Ha adatbázis hiba történt.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 *       405:
 *         description: Ha nem POST metódust használunk.
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
  if (req.method === 'POST') {
    const { student_id } = req.body;

    if (!student_id) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    try {
      // Adatbázis kapcsolat létrehozása
      const connection = await connectToDatabase();

      // Frissítés: az adott diák "access" mezőjének módosítása "nyitva" értékre
      const [result] = await connection.execute(
        'UPDATE students SET access = ? WHERE student_id = ?',
        ['nyithato', student_id]
      );

      // Ellenőrizzük, hogy történt-e változás
      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Locker opened successfully' });
      } else {
        return res.status(404).json({ error: 'Student not found' });
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}