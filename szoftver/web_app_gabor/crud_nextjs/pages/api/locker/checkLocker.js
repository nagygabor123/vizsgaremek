// pages/api/locker/checkLocker.js

/**
 * @swagger
 * /api/locker/checkLocker:
 *   get:
 *     summary: Az RFID kártya státuszának lekérdezése
 *     description: Lekérdezi a diák hozzáférési státuszát az RFID kártya alapján, és visszaadja azt.
 *     parameters:
 *       - in: query
 *         name: rfid
 *         required: true
 *         description: Az RFID kártya azonosítója, amely alapján ellenőrizzük a hozzáférési státuszt.
 *         schema:
 *           type: string
 *           example: "F7F59C7A"
 *     tags:
 *       - Locker
 *     responses:
 *       200:
 *         description: A sikeres lekérdezés, amely tartalmazza a diák hozzáférési státuszát.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   access:
 *                     type: string
 *                     description: A diák hozzáférési státusza.
 *                     example: "nyitva"
 *       400:
 *         description: Ha az RFID paraméter hiányzik a kérésből.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "RFID is required"
 *       404:
 *         description: Ha az RFID kártya nem található az adatbázisban.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "RFID not found"
 *       500:
 *         description: Ha hiba történik az adatbázis kapcsolat során.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 *       405:
 *         description: Ha nem GET metódust használunk.
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
  if (req.method === 'GET') {
    const { rfid } = req.query;

    if (!rfid) {
      return res.status(400).json({ error: 'RFID is required' });
    }

    try {
      // Adatbázis kapcsolat létrehozása
      const connection = await connectToDatabase();

      // Lekérdezés az RFID alapján
      const [rows] = await connection.execute('SELECT access FROM students WHERE rfid_tag = ?', [rfid]);

      // Ellenőrizzük, hogy van-e találat
      if (rows.length > 0) {
        const access = rows[0].access;
        return res.status(200).json(rows );
      } else {
        return res.status(404).json({ error: 'RFID not found' });
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}