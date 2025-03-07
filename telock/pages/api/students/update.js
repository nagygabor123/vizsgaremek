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
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { student_id, full_name, class: studentClass, rfid_tag } = req.body;

    if (!student_id || !full_name || !studentClass || !rfid_tag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = await connectToDatabase();
    try {
      const [existingLocker] = await db.execute(
        'SELECT relationship_id, locker_id FROM locker_relationships WHERE rfid_tag = ?',
        [rfid_tag]
      );

      if (existingLocker.length > 0) {
        // Call the API to delete the student
        const deleteResponse = await fetch(`vizsgaremek-mocha.vercel.app/api/students/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ student_id }),
        });

        if (!deleteResponse.ok) {
          return res.status(500).json({ message: 'Failed to delete student' });
        }
      }

      // Call the API to create the student again, preserving the locker relationship
      const createResponse = await fetch(`vizsgaremek-mocha.vercel.app/api/students/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id,
          full_name,
          class: studentClass,
          rfid_tag,
        }),
      });

      if (!createResponse.ok) {
        return res.status(500).json({ message: 'Failed to create student' });
      }

      // If locker relationship exists, update it to maintain the old locker_id
      if (existingLocker.length > 0) {
        await db.execute(
          'INSERT INTO locker_relationships (locker_id, rfid_tag) VALUES (?, ?)',
          [existingLocker[0].locker_id, rfid_tag]
        );
      }

      res.status(200).json({ message: 'Student and locker relationship updated successfully' });
    } catch (error) {
      console.error('Error updating student:', error);  
      res.status(500).json({ message: 'Error updating student and locker relationship' });
    } finally {
      await db.end();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
