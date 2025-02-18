
/**
 * @swagger
 * /api/config/getEmployees:
 *   get:
 *     summary: Adminisztrátorok lekérdezése
 *     description: Lekéri az összes adminisztrátor adatait az `admins` táblából.
 *     tags:
 *       - Configuration
 *     responses:
 *       200:
 *         description: Sikeres lekérdezés, az adminisztrátorok listájának visszaadása.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   admin_id:
 *                     type: integer
 *                     description: Az adminisztrátor egyedi azonosítója.
 *                     example: 1
 *                   full_name:
 *                     type: string
 *                     description: Az adminisztrátor teljes neve.
 *                     example: "Kiss Péter"
 *                   position:
 *                     type: string
 *                     description: Az adminisztrátor pozíciója.
 *                     example: "Rendszergazda"
 *       500:
 *         description: Hiba történt az adminisztrátorok adatainak lekérése közben.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching employees"
 *       405:
 *         description: Hibás HTTP metódus (csak GET engedélyezett).
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

    try {
      const [rows] = await db.execute('SELECT admin_id, full_name, position FROM admins');
      res.status(200).json(rows); 
    } catch (error) {
      res.status(500).json({ message: 'Error fetching employees' });
    } finally {
      await db.end(); // Kapcsolat lezárása
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
