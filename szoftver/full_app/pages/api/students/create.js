
/**
 * @swagger
 * /api/students/create:
 *   post:
 *     summary: Új diák létrehozása
 *     description: Létrehoz egy új diákot a megadott adatokkal.
 *     tags:
 *       - Students
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 description: A diák azonosítója.
 *                 example: "OM56555"
 *               full_name:
 *                 type: string
 *                 description: A diák teljes neve.
 *                 example: "fasz kalap"
 *               class:
 *                 type: string
 *                 description: A diák osztálya.
 *                 example: "12.A"
 *               rfid_tag:
 *                 type: string
 *                 description: A diák RFID címkéje.
 *                 example: "58D90E3E"
 *     responses:
 *       201:
 *         description: Sikeresen létrehozott diák
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student created"
 *       400:
 *         description: Hiányzó kötelező mezők
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Hiba a diák létrehozása során
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating student"
 *       405:
 *         description: A HTTP metódus nem engedélyezett
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
