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

import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { student } = req.query;

  if (!student) {
    return res.status(400).json({ message: "Missing student identifier" });
  }

  const db = await connectToDatabase();

  try {
    const [result] = await db.query('UPDATE students SET access = "nyithato" WHERE student_id = ?', [student]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const eventName = `student_access_${student}`;
    await db.query(`CREATE EVENT ??
                    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 10 MINUTE
                    DO UPDATE students SET access = 'zarva' WHERE student_id = ?`, [eventName, student]);
    
    await db.end();

    return res.status(200).json({ message: `Student ${student} access updated to nyithato and reset event created` });
  } catch (error) {
    console.error("Error updating access state:", error);
    await db.end();
    return res.status(500).json({ message: "Failed to update access state and create reset event" });
  }
}
