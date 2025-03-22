/**
 * @swagger
 * /api/config/setYearStartEnd:
 *   post:
 *     summary: Évkezdés és évvége dátumának frissítése
 *     description: Frissíti a `year_schedule` táblában az év kezdő vagy záró dátumát a megadott típus alapján.
 *     tags:
 *       - Configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - which_day
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [kezd, veg]
 *                 description: A frissítendő dátum típusa (évkezdés vagy évvége).
 *                 example: "kezd"
 *               which_day:
 *                 type: string
 *                 format: date
 *                 description: Az új dátum (ÉÉÉÉ-HH-NN formátumban).
 *                 example: "2024-09-02"
 *     responses:
 *       200:
 *         description: Sikeres frissítés
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sikeres frissítés"
 *                 updatedType:
 *                   type: string
 *                   example: "kezd"
 *                 updatedDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-09-02"
 *       400:
 *         description: Hiányzó vagy érvénytelen paraméterek
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Type és date paraméter szükséges"
 *       404:
 *         description: Nem található megfelelő rekord
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nem található a megfelelő rekord"
 *       500:
 *         description: Adatbázis hiba
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Adatbázis csatlakozási hiba"
 *       405:
 *         description: Hibás HTTP metódus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "A módszer nem engedélyezett"
 */

import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, which_day } = req.body;

    if (!type || !which_day) {
      return res.status(400).json({ error: 'Type és date paraméter szükséges' });
    }

    if (type !== 'kezd' && type !== 'veg') {
      return res.status(400).json({ error: 'Csak a kezd és veg típus frissíthető' });
    }

    let connection;

    try {
      connection = await connectToDatabase();
      
      let query = 'UPDATE year_schedule SET which_day = ? WHERE type = ?';
      let values = [which_day, type];

      const [result] = await connection.execute(query, values);

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Sikeres frissítés', updatedType: type, updatedDate: which_day });
      } else {
        return res.status(404).json({ error: 'Nem található a megfelelő rekord' });
      }
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    } finally {
      if (connection) {
        await connection.end(); // Kapcsolat lezárása
      }
    }
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}
