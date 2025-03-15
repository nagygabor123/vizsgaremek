/**
 * @swagger
 * /api/system/studentAccess:
 *   post:
 *     summary: Diák hozzáférésének ideiglenes megnyitása
 *     description: A megadott diák "access" állapotát "nyithato" értékre állítja, majd 10 perc elteltével automatikusan "zarva" állapotra váltja vissza.
 *     parameters:
 *       - in: query
 *         name: student
 *         required: true
 *         description: A diák azonosítója.
 *         schema:
 *           type: string
 *           enum: [OM11111, OM22222, OM33333, OM44444]
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Sikeres állapotfrissítés és időzített esemény létrehozása.
 *       400:
 *         description: Hiányzó diák azonosító.
 *       404:
 *         description: A megadott diák nem található.
 *       500:
 *         description: Hiba történt az adatbázis frissítése vagy az esemény létrehozása közben.
 */

import { neon } from '@neondatabase/serverless';
import cron from 'node-cron';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { student } = req.query;

  if (!student) {
    return res.status(400).json({ message: "Missing student identifier" });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    const updateResult = await sql(
      'UPDATE students SET access = $1 WHERE student_id = $2',
      ['nyithato', student]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    cron.schedule('*/3 * * * *', async () => {
      await sql("UPDATE students SET access = 'zarva' WHERE student_id = $1", [student]);
      console.log(`Access reset for student ${student}`);
    });

    return res.status(200).json({ message: `Student ${student} access updated to nyithato. A reset task has been scheduled.` });
  } catch (error) {
    console.error("Error updating access state:", error);
    return res.status(500).json({ message: "Failed to update access state" });
  }
}