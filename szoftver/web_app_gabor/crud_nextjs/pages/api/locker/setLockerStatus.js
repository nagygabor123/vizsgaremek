/**
 * @swagger
 * /api/locker/setLockerStatus:
 *   patch:
 *     summary: Zár állapotának frissítése
 *     description: Frissíti a zár állapotát (be/ki) állapotra, a jelenlegi állapottól függően.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: A zár azonosítója, amelyet módosítani szeretnénk. Az értéknek 1 és 99 között kell lennie.
 *         schema:
 *           type: integer
 *           example: 2
 *     tags:
 *       - Locker
 *     responses:
 *       200:
 *         description: A zár állapota sikeresen frissítve lett.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Szekrény 2 státusza frissítve 'be' (-re)"
 *       400:
 *         description: Ha a zár azonosítója nem érvényes (nem szám vagy kívül esik az engedélyezett tartományon).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Érvénytelen szekrény Id"
 *       404:
 *         description: Ha a zár nem található az adatbázisban.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A szekrény nem található"
 *       500:
 *         description: >
 *           Ha hiba történt az adatbázis kapcsolat vagy a zár állapotának frissítése során vagy "Sikertelen szekrény státusz frissétés".
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Szerver hiba"
 *       405:
 *         description: Ha nem PATCH metódust használunk.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A módszer nem engedélyezett"
 */
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    const { id } = req.query;
    const lockerId = parseInt(id);
    if (isNaN(lockerId) || lockerId < 1 || lockerId > 99) {
      return res.status(400).json({ message: 'Érvénytelen szekrény Id' });
    }

    try {
      const db = await connectToDatabase();
      const [rows] = await db.execute('SELECT status FROM lockers WHERE locker_id = ?', [lockerId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Szekrény nem található' });
      }

      const currentStatus = rows[0].status;
      const newStatus = currentStatus === 'be' ? 'ki' : 'be';
      const [result] = await db.execute(
        'UPDATE lockers SET status = ? WHERE locker_id = ?',
        [newStatus, lockerId]
      );

      if (result.affectedRows === 0) {
        return res.status(500).json({ message: 'Sikertelen szekrény státusz frissétés' });
      }

      res.status(200).json({ message: `Szekrény ${lockerId} státusza frissítve '${newStatus}' (-re)` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  } else {
    res.status(405).json({ message: 'A módszer nem engedélyezett' });
  }
}