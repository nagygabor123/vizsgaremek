/**
 * @swagger
 * /api/system/closeOpen:
 *   post:
 *     summary: Frissíti a rendszer hozzáférési állapotát és a rendszer státuszt
 *     description: A POST kérés frissíti a diákok hozzáférési állapotát ("nyitva" vagy "zárva"), valamint frissíti a rendszer státuszát.
 *     tags:
 *       - System
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
 *                 description: A művelet, amelyet végre kell hajtani a diákok hozzáférésének módosítására és a rendszer státuszának frissítésére.
 *                 example: "open"
 *     responses:
 *       200:
 *         description: A diákok hozzáférési állapotának és a rendszer státuszának frissítése sikeres volt.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All students' access updated to nyitva and system status updated"
 *       400:
 *         description: Érvénytelen művelet (ha a 'action' érték nem 'open' vagy 'close').
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid action"
 *       405:
 *         description: Az adott HTTP metódus nem engedélyezett (nem POST kérés).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Method Not Allowed"
 *       500:
 *         description: Hiba történt a hozzáférési állapot és a rendszer státuszának frissítése során.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update access state and system status"
 */

import { connectToDatabase } from '../../../lib/db';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action } = req.body;  // A request body-ban jön a "close" vagy "open" üzenet

    // Ellenőrizzük, hogy a kapott action érték érvényes-e
    if (action !== 'close' && action !== 'open') {
      return res.status(400).json({ message: "Invalid action" });
    }

    const db = await connectToDatabase();
    // Az access mezőt frissítjük mindenkinek a students táblában
    const newAccessState = action === 'close' ? 'zarva' : 'nyithato';

    try {
      // Az 'access' oszlopot frissítjük
      await db.query('UPDATE students SET access = ?', [newAccessState]);

      // A rendszer státuszának frissítése
      await db.query('UPDATE system_status SET status = ? WHERE id = 1', [newAccessState]);

      return res.status(200).json({ message: `All students' access updated to ${newAccessState} and system status updated` });
    } catch (error) {
      console.error("Error updating access state:", error);
      return res.status(500).json({ message: "Failed to update access state and system status" });
    }
  } else {
    // Ha nem POST metódust használunk, akkor 405-ös hibát küldünk
    res.status(405).json({ message: "Method Not Allowed" });
  }
}