/**
 * @swagger
 * /api/locker/checkLocker:
 *   get:
 *     summary: A diák státuszának lekérdezése RFID alapján
 *     description: Lekérdezi a diák hozzáférési státuszát az RFID azonosítója alapján, és visszaadja az értékét.
 *     parameters:
 *       - in: query
 *         name: rfid
 *         required: true
 *         description: Az RFID kártya azonosítója, amely alapján ellenőrizzük a hozzáférési státuszt.
 *         schema:
 *           type: string
 *           enum: [F7F59C7A, DA6BD581, 030FC70A, 53D00E3E]
 *     tags:
 *       - Locker
 *     responses:
 *       200:
 *         description: A sikeres lekérdezés, amely tartalmazza a diák hozzáférési státuszát (nyithato/zarva)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access:
 *                   type: string
 *                   description: A diák hozzáférési státusza.
 *                   example: "nyithato"
 *       400:
 *         description: Ha az RFID paraméter hiányzik a kérésből.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "RFID szükséges"
 *       404:
 *         description: Ha az RFID kártya nem található az adatbázisban.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "RFID nem található"
 *       500:
 *         description: Ha hiba történik az adatbázis kapcsolat során.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Adatbázis csatlakozási hiba"
 *       405:
 *         description: >
 *           Belső szerverhiba vagy adatbázis csatlakozási hiba 
 *           (Pl: ha az adatbázis nem érhető el).
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
  if (req.method === 'GET') {
    const { rfid } = req.query;

    if (!rfid) {
      return res.status(400).json({ error: 'RFID szükséges' });
    }

    let connection;

    try {
      connection = await connectToDatabase();
      const [rows] = await connection.execute('SELECT access FROM students WHERE rfid_tag = ?', [rfid]);

      if (rows.length > 0) {
       // const access = rows[0].access;
        return res.status(200).json(rows);
      } else {
        return res.status(404).json({ error: 'RFID nem található' });
      }
    } catch (error) {
      console.error('Adatbazis hiba:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    } finally {
      if (connection) {
        await connection.end(); // kapcsolat lezárása
      }
    }
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}
