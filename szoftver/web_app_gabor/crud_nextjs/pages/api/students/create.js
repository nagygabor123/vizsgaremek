// pages/api/students/create.js
import { connectToDatabase } from '../../../lib/db';

/**
 * @swagger
 * /api/students/create:
 *   post:
 *     summary: Új diák létrehozása
 *     description: Új diák hozzáadása az adatbázishoz a megadott adatokkal.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - student_id
 *               - full_name
 *               - class
 *               - rfid_tag
 *             properties:
 *               student_id:
 *                 type: string
 *                 description: A diák egyedi azonosítója.
 *               full_name:
 *                 type: string
 *                 description: A diák teljes neve.
 *               class:
 *                 type: string
 *                 description: Az osztály, amelybe a diák tartozik.
 *               rfid_tag:
 *                 type: string
 *                 description: A diák RFID kártyájának azonosítója.
 *     responses:
 *       201:
 *         description: A diák sikeresen létrehozva.
 *       400:
 *         description: Hiányzó kötelező mezők.
 *       500:
 *         description: Hiba történt a diák létrehozása közben.
 *       405:
 *         description: Nem támogatott HTTP metódus.
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { student_id, full_name, class: studentClass, rfid_tag } = req.body;

    if (!student_id || !full_name || !studentClass || !rfid_tag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();

    try {
      await db.execute(
        'INSERT INTO students (student_id, full_name, class, rfid_tag) VALUES (?, ?, ?, ?)',
        [student_id, full_name, studentClass, rfid_tag]
      );
      res.status(201).json({ message: 'Student created' });
    } catch (error) {
      res.status(500).json({ message: 'Error creating student' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
