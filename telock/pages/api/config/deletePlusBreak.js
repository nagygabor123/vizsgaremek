/**
 * @swagger
 * /api/config/deletePlusBreak:
 *   delete:
 *     summary: Plusznap vagy szünet törlése
 *     description: Törli a megadott `year_schedule_id` azonosítójú rekordot az `year_schedule` táblából.
 *     tags:
 *       - Configuration
 *     parameters:
 *       - in: query
 *         name: year_schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: A törlendő rekord azonosítója.
 *     responses:
 *       200:
 *         description: Sikeres törlés, visszaadja a törölt rekord azonosítóját.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sikeres törlés"
 *                 deletedId:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Hiányzó vagy tiltott ID paraméter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hiányzó ID paraméter."
 *       404:
 *         description: Nem található rekord a megadott ID-val.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nem található rekord ezzel az ID-val."
 *       500:
 *         description: Adatbázis hiba vagy a törlés sikertelen.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Adatbázis csatlakozási hiba"
 *       405:
 *         description: Hibás HTTP metódus (csak DELETE engedélyezett).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "A módszer nem engedélyezett"
 */
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { year_schedule_id } = req.query;

    if (!year_schedule_id) {
      return res.status(400).json({ error: 'Hiányzó ID paraméter.' });
    }

    if (year_schedule_id === '1' || year_schedule_id === '2') {
      return res.status(400).json({ error: 'Az ID értéke nem lehet 1 vagy 2.' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
      const record = await sql('SELECT * FROM year_schedule WHERE year_schedule_id = $1', [year_schedule_id]);
      
      if (record.length === 0) {
        return res.status(404).json({ error: 'Nem található rekord ezzel az ID-val.' });
      }

      const result = await sql('DELETE FROM year_schedule WHERE year_schedule_id= $1', [year_schedule_id]);

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Sikeres törlés', deletedId: year_schedule_id });
      } else {
        return res.status(500).json({ error: 'Nem sikerült törölni a rekordot.' });
      }
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    } 
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}
