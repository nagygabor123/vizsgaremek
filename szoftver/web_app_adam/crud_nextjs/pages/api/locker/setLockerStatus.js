// pages/api/locker/setLockerStatus.js

/**
 * @swagger
 * /api/locker/setLockerStatus:
 *   patch:
 *     summary: Zár állapotának frissítése
 *     description: Frissíti a zár állapotát "nyitva" (be) vagy "zárva" (ki) állapotra, a jelenlegi állapottól függően.
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
 *                   example: "Locker 2 status updated to 'ki'"
 *       400:
 *         description: Ha a zár azonosítója nem érvényes (nem szám vagy kívül esik az engedélyezett tartományon).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid locker number"
 *       404:
 *         description: Ha a zár nem található az adatbázisban.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Locker not found"
 *       500:
 *         description: Ha hiba történt az adatbázis kapcsolat vagy a zár állapotának frissítése során.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *       405:
 *         description: Ha nem PATCH metódust használunk.
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
  if (req.method === 'PATCH') {
    // Extract locker number from the URL
    const { id } = req.query;

    // Validate the id (ensure it's a number and within 1-99 range)
    const lockerId = parseInt(id);
    if (isNaN(lockerId) || lockerId < 1 || lockerId > 99) {
      return res.status(400).json({ message: 'Invalid locker number' });
    }

    try {
      // Connect to the database
      const db = await connectToDatabase();

      // Get the current status of the locker
      const [rows] = await db.execute('SELECT status FROM lockers WHERE locker_id = ?', [lockerId]);

      // If no rows are returned, the locker doesn't exist
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Locker not found' });
      }

      // Determine the new status
      const currentStatus = rows[0].status;
      const newStatus = currentStatus === 'be' ? 'ki' : 'be';

      // Update the locker status
      const [result] = await db.execute(
        'UPDATE lockers SET status = ? WHERE locker_id = ?',
        [newStatus, lockerId]
      );

      // If no rows were affected, something went wrong
      if (result.affectedRows === 0) {
        return res.status(500).json({ message: 'Failed to update locker status' });
      }

      // Return success response
      res.status(200).json({ message: `Locker ${lockerId} status updated to '${newStatus}'` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}