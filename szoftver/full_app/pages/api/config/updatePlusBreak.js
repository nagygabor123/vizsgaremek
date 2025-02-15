/**
 * @swagger
 * /api/config/updatePlusBreak:
 *   post:
 *     summary: Plusznap vagy szünet frissítése az év rendjében
 *     description: Egy meglévő plusznap vagy szünet adatait módosítja az `year_schedule` táblában.
 *     tags:
 *       - Configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nev
 *               - which_day
 *               - replace_day
 *             properties:
 *               id:
 *                 type: integer
 *                 description: Az év rendjében lévő rekord azonosítója (1 és 2 nem frissíthető).
 *                 example: 3
 *               nev:
 *                 type: string
 *                 description: A plusznap vagy szünet neve.
 *                 example: "Vasárnapi tanítás"
 *               which_day:
 *                 type: string
 *                 format: date
 *                 description: Az eredeti dátum (YYYY-MM-DD formátumban).
 *                 example: "2024-11-01"
 *               replace_day:
 *                 type: string
 *                 description: A nap, amire az eredeti dátumot cseréljük.
 *                 example: "friday"
 *     responses:
 *       200:
 *         description: A rekord sikeresen frissítve.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sikeres frissítés"
 *                 updatedId:
 *                   type: integer
 *                   example: 3
 *                 updatedNev:
 *                   type: string
 *                   example: "Vasárnapi tanítás"
 *                 updatedDate:
 *                   type: string
 *                   format: date
 *                   example: "2024-11-01"
 *                 updatedReplaceDay:
 *                   type: string
 *                   example: "friday"
 *       400:
 *         description: Hibás kérés (hiányzó paraméterek vagy tiltott ID).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Id, nev, which_day és replace_day paraméterek szükségesek"
 *       404:
 *         description: Nem található a megfelelő rekord.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nem található a megfelelő rekord"
 *       500:
 *         description: Adatbázis hiba.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Adatbázis csatlakozási hiba"
 *       405:
 *         description: A kért HTTP metódus nem engedélyezett.
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
    const { id, nev, which_day, replace_day } = req.body;

    if (!id || !nev || !which_day || !replace_day) {
      return res.status(400).json({ error: 'Id, nev, which_day és replace_day paraméterek szükségesek' });
    }

    if (id === 1 || id === 2) {
      return res.status(400).json({ error: 'Az 1-es és 2-es id nem frissíthető' });
    }

    try {
      const connection = await connectToDatabase();
      
      let query = 'UPDATE year_schedule SET nev = ?, which_day = ?, replace_day = ? WHERE year_schedule_id = ?';
      let values = [nev, which_day, replace_day, id];

      const [result] = await connection.execute(query, values);

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Sikeres frissítés', updatedId: id, updatedNev: nev, updatedDate: which_day, updatedReplaceDay: replace_day });
      } else {
        return res.status(404).json({ error: 'Nem található a megfelelő rekord' });
      }
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    }
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}
