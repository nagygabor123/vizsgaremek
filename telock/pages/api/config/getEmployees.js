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
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const sql = neon(process.env.DATABASE_URL);

    try {
      const result = await sql('SELECT admin_id, full_name, short_name, position, osztalyfonok FROM admins');
      res.status(200).json(result);
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error fetching employees' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}