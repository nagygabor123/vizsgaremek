/**
 * @swagger
 * /api/system/studentCloseOpen:
 *   post:
 *     summary: Frissíti egy adott diák hozzáférési állapotát és a rendszer státuszát
 *     description: A POST kérés frissíti a megadott diák hozzáférési állapotát ("nyitva" vagy "zárva"), valamint frissíti a rendszer státuszát.
 *     tags:
 *       - System
 *     parameters:
 *       - in: query
 *         name: student
 *         required: true
 *         schema:
 *           type: string
 *           example: "OM44444"
 *         description: A diák OM azonosítója
 *     requestBody:
 *       description: A kívánt művelet ("close" vagy "open") megadása.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [open, close]
 *                 description: A művelet, amelyet végre kell hajtani a diák hozzáférésének módosítására.
 *                 example: "open"
 *     responses:
 *       200:
 *         description: A diák hozzáférési állapotának és a rendszer státuszának frissítése sikeres volt.
 *       400:
 *         description: Érvénytelen művelet vagy hiányzó student azonosító.
 *       405:
 *         description: Az adott HTTP metódus nem engedélyezett.
 *       500:
 *         description: Hiba történt a hozzáférési állapot frissítése során.
 */

import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { action } = req.body;
  const { student } = req.query;

  if (!student) {
    return res.status(400).json({ message: "Missing student identifier" });
  }
  
  if (action !== 'close' && action !== 'open') {
    return res.status(400).json({ message: "Invalid action" });
  }

  const db = await connectToDatabase();
  const newAccessState = action === 'close' ? 'zarva' : 'nyithato';

  try {
    // A diák hozzáférésének frissítése
    const [result] = await db.query('UPDATE students SET access = ? WHERE student_id = ?', [newAccessState, student]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    // A rendszer státuszának frissítése
    await db.query('UPDATE system_status SET status = ? WHERE id = 1', [newAccessState]);

    return res.status(200).json({ message: `Student ${student} access updated to ${newAccessState} and system status updated` });
  } catch (error) {
    console.error("Error updating access state:", error);
    return res.status(500).json({ message: "Failed to update access state and system status" });
  }
}
