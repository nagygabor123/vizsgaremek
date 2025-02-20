/**
 * @swagger
 * /api/config/updateEmployee:
 *   put:
 *     summary: Adminisztrátor adatainak frissítése
 *     description: Egy meglévő adminisztrátor adatait frissíti az adatbázisban.
 *     tags:
 *       - Configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - admin_id
 *               - full_name
 *               - position
 *             properties:
 *               admin_id:
 *                 type: integer
 *                 description: Az adminisztrátor egyedi azonosítója.
 *                 example: 1
 *               full_name:
 *                 type: string
 *                 description: Az adminisztrátor teljes neve.
 *                 example: "Szalkai-Szabó Ádám"
 *               position:
 *                 type: string
 *                 description: Az adminisztrátor pozíciója.
 *                 example: "rendszergazda"
 *     responses:
 *       200:
 *         description: Az adminisztrátor sikeresen frissítve.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin updated"
 *       400:
 *         description: Hiányzó kötelező mezők.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Hiba történt az adminisztrátor frissítése közben.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating admin"
 *                 error:
 *                   type: string
 *                   description: A hibaüzenet részletei.
 *       405:
 *         description: Nem támogatott HTTP metódus.
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
  if (req.method === 'PUT') {
    const { admin_id, full_name, position } = req.body;

    if (!admin_id || !full_name || !position) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();
    try {
      await db.execute(
        'UPDATE admins SET full_name = ?, position = ? WHERE admin_id = ?',
        [full_name, position, admin_id]
      );
      res.status(200).json({ message: 'Admin updated' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating admin', error: error.message });
    } finally {
      await db.end();  
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
