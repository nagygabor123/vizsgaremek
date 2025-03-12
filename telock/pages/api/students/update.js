/**
 * @swagger
 * /api/students/update:
 *   put:
 *     summary: Diák adatainak frissítése
 *     description: A diák adatainak frissítésére szolgáló API végpont, amely lehetővé teszi a diák nevének, osztályának és RFID címkéjének módosítását.
 *     tags:
 *       - Students
 *     requestBody:
 *       description: A diák adatainak frissítéséhez szükséges adatok.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 description: A módosítani kívánt diák azonosítója.
 *                 example: "OM44444"
 *               full_name:
 *                 type: string
 *                 description: A diák teljes neve.
 *                 example: "Pál Edvin"
 *               class:
 *                 type: string
 *                 description: A diák osztálya.
 *                 example: "13.D"
 *               rfid_tag:
 *                 type: string
 *                 description: A diák RFID címkéje.
 *                 example: "53D00E3E"
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
 *                   example: "Student updated"
 *       400:
 *         description: Hiányzó vagy érvénytelen mezők
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       404:
 *         description: A diák nem található
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Student not found"
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
 *       500:
 *         description: Hiba történt a diák adatainak frissítése során
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating student"
 */
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { student_id, full_name, class: studentClass, rfid_tag } = req.body;

    if (!student_id || !full_name || !studentClass || !rfid_tag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const sql = neon(process.env.DATABASE_URL);
    try {
      // Lekérdezzük, hogy létezik-e a diák a rendszerben
      const existingStudent = await sql(
        'SELECT * FROM students WHERE student_id = $1',
        [student_id]
      );

      // Ha a diák nem található
      if (existingStudent.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      // Ha az RFID változott, először frissítjük a locker_relationships táblát
      if (existingStudent[0].rfid_tag !== rfid_tag) {
        await sql(
          'UPDATE locker_relationships SET rfid_tag = $1 WHERE rfid_tag = $2',
          [rfid_tag, existingStudent[0].rfid_tag]
        );
      }

      // Frissítjük a diák nevét és osztályát a students táblában
      await sql(
        'UPDATE students SET full_name = $1, class = $2 WHERE student_id = $3',
        [full_name, studentClass, student_id]
      );

      // Ha az RFID változott, akkor a students táblában is frissítjük az RFID-t
      if (existingStudent[0].rfid_tag !== rfid_tag) {
        await sql(
          'UPDATE students SET rfid_tag = $1 WHERE student_id = $2',
          [rfid_tag, student_id]
        );
      }

      res.status(200).json({ message: 'Student and locker relationship updated successfully' });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Error updating student and locker relationship', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


