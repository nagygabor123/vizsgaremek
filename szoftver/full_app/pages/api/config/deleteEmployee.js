
/**
 * @swagger
 * /api/config/deleteEmployee:
 *   delete:
 *     summary: Törli az adminisztrátort az adatbázisból.
 *     description: Ezzel az API végponttal törölheted az adminisztrátorokat az adatbázisból az admin_id alapján. Az admin_id 1 és 2 nem törölhető.
 *     tags:
 *       - Configuration
 *     parameters:
 *       - in: query
 *         name: admin_id
 *         required: true
 *         description: Az adminisztrátor azonosítója, amelyet törölni szeretnél.
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: A törlés sikeres volt.
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
 *                   example: 3
 *       400:
 *         description: Hibás kérés, ha az admin_id hiányzik vagy az értéke 1 vagy 2.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Az ID értéke nem lehet 1 vagy 2."
 *       404:
 *         description: Az adminisztrátor nem található az adatbázisban.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Nem található adminisztrátor ezzel az ID-val."
 *       500:
 *         description: Adatbázis hiba történt.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Adatbázis csatlakozási hiba"
 *       405:
 *         description: A megadott HTTP metódus nem támogatott.
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
  if (req.method === 'DELETE') {
    const { admin_id } = req.query;

    if (!admin_id) {
      return res.status(400).json({ error: 'Hiányzó ID paraméter.' });
    }

    if (admin_id === '1' || admin_id === '2') {
      return res.status(400).json({ error: 'Az ID értéke nem lehet 1 vagy 2.' });
    }

    let connection;
    try {
      connection = await connectToDatabase();
            const [record] = await connection.execute('SELECT * FROM admins WHERE admin_id = ?', [admin_id]);
      
      if (record.length === 0) {
        return res.status(404).json({ error: 'Nem található adminisztrátor ezzel az ID-val.' });
      }

      const [result] = await connection.execute('DELETE FROM admins WHERE admin_id = ?', [admin_id]);

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: 'Sikeres törlés', deletedId: admin_id });
      } else {
        return res.status(500).json({ error: 'Nem sikerült törölni az adminisztrátort.' });
      }
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    } finally {
      if (connection) {
        await connection.end(); 
      }
    }
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}
