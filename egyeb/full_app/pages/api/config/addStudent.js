/**
 * @swagger
 * /api/config/addStudent:
 *   post:
 *     summary: Diákok CSV fájl alapú feltöltése
 *     description: A felhasználó CSV fájlt tölthet fel, amely tartalmazza a diákok adatait, és ezek az adatok bekerülnek az adatbázisba.
 *     tags:
 *       - Configuration
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: A CSV fájl feltöltése
 *     responses:
 *       200:
 *         description: Sikeresen hozzáadott diákok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A diákok sikeresen hozzáadva"
 *       400:
 *         description: Hiányzó mezők vagy duplikált bejegyzés vagy "Nincs fájl feltöltve "
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hiányoznak egy tanuló kötelező mezői" 
 *       405:
 *         description: A HTTP metódus nem engedélyezett
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "'Csak a POST metódus használható"
 *       500:
 *         description: Hiba a fájl feldolgozása vagy az adatbázis művelet során
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hiba a csv fájl elemzésekor"
 */
import { connectToDatabase } from '../../../lib/db';
import fs from 'fs';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak a POST metódus használható' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Hiba a csv fájl elemzésekor:', err);
      return res.status(500).json({ error: 'Hiba a csv fájl elemzésekor' });
    }

    const file = files.file[0];
    if (!file) {
      return res.status(400).json({ error: 'Nincs fájl feltöltve' });
    }

    let db;
    try {
      const filePath = file.path;
      const csvData = fs.readFileSync(filePath, 'utf8');
      const rows = csvData.split('\n').filter(Boolean);
      const header = rows.shift().split(',');
      const data = rows.map((row) => {
        const values = row.split(',');
        return header.reduce((acc, key, index) => {
          acc[key.trim()] = values[index]?.trim();
          return acc;
        }, {});
      });

      db = await connectToDatabase(); 
      const insertQuery = 'INSERT INTO students (`student_id`, `full_name`, `class`, `rfid_tag`, `access`) VALUES (?, ?, ?, ?, ?)';

      for (let student of data) {
        const { student_id, full_name, class: studentClass, rfid_tag, access } = student;

        if (!student_id || !full_name || !studentClass || !rfid_tag) {
          return res.status(400).json({ message: 'Hiányoznak egy tanuló kötelező mezői' });
        }

        const accessValue = access || 'zarva';

        try {
          await db.execute(insertQuery, [student_id, full_name, studentClass, rfid_tag, accessValue]);
        } catch (dbError) {
          if (dbError.code === 'ER_DUP_ENTRY') {
            console.warn(`Ismétlődő adat: ${student_id}`);
            return res.status(400).json({
              message: `Ismétlődő adat található a következő diákazonosítóhoz: ${student_id}. Ez a rekord már létezik.`,
            });
          } else {
            throw dbError;
          }
        }
      }

      return res.status(200).json({ message: 'A diákok sikeresen hozzáadva' });
    } catch (error) {
      console.error('Hiba a fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    } finally {
      if (db) {
        await db.end(); // Az adatbázis kapcsolat lezárása
      }
    }
  });
}
