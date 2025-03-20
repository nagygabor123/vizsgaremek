/**
 * @swagger
 * /api/config/addPlusBreak:
 *   post:
 *     summary: Plusznapok és szünetek hozzáadása az év rendjéhez
 *     description: A végpont lehetővé teszi új plusznapok és szünetek rögzítését az év rendjében.
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
 *               nev:
 *                 type: string
 *                 description: A szünet vagy plusz nap neve.
 *                 example: "Tavaszi szünet"
 *               which_day:
 *                 type: string
 *                 format: date
 *                 description: Az új dátum (ÉÉÉÉ-HH-NN formátumban).
 *                 example: "2025-04-02"
 *               replace_day:
 *                 type: string
 *                 format: date
 *                 description: Az új dátum (ÉÉÉÉ-HH-NN formátumban).
 *                 example: "2025-04-10"
 *     responses:
 *       200:
 *         description: "Sikeres frissítés"
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Sikeres frissítés"
 *             updatedType:
 *               type: string
 *               example: "plusznap"
 *             updatedDate:
 *               type: string
 *               example: "2024-11-01"
 *       400:
 *         description: "Hibás kérés - hiányzó vagy érvénytelen paraméterek."
 *       404:
 *         description: "Nem található a megfelelő rekord."
 *       500:
 *         description: "Adatbázis csatlakozási hiba."
 */
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, nev, which_day, replace_day } = req.body;

    if (!type || !nev || !which_day || !replace_day) {
      return res.status(400).json({ error: 'Hiányzó paraméterek.' });
    }

    if (type !== 'szunet' && type !== 'plusznap' && type !== 'tanitasnelkul') {
      return res.status(400).json({ error: 'Csak a szünetet illetve a plusznapokat lehet feltölteni' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      let query = 'INSERT INTO year_schedule (type, nev, which_day, replace_day) VALUES ($1, $2, $3, $4);';
      let values = [type, nev, which_day, replace_day];
      const [result] = await sql(query, values);

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Sikeres frissítés', updatedType: type, updatedDate: which_day });
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
