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
      await dataCheck(rfid_tag);

      const studentData = await sql(
        'SELECT rfid_tag FROM students WHERE student_id = $1',
        [student_id]
      );
    
      if (studentData.length === 0) {
        return res.status(404).json({ message: 'Student not found' });
      }

      const existingLocker = await sql(
        'SELECT relationship_id, locker_id FROM locker_relationships WHERE rfid_tag = $1',
        [studentData[0].rfid_tag]
      );

      if (existingLocker.length > 0) {
        const latestStudent = await sql('SELECT MAX(student_id) AS max_id FROM students');
        const newStudentId = latestStudent[0].max_id + 1;

        await sql(
          'INSERT INTO students (student_id, full_name, class, rfid_tag, access) VALUES ($1, $2, $3, $4, $5);',
          [newStudentId, full_name, studentClass, rfid_tag, 'zarva']
        );

        await sql(
          'UPDATE locker_relationships SET rfid_tag = $1 WHERE relationship_id = $2',
          [rfid_tag, existingLocker[0].relationship_id]
        );

        await deleteStudent(student_id);
        await generateStudentGroups(student_id, studentClass);

        res.status(200).json({ message: 'Student and locker relationship updated successfully' });
      } else {
        return res.status(404).json({ message: 'Locker relationship not found for the student' });
      }
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Error updating student and locker relationship', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function dataCheck(student_id, rfid_tag) {
  const existingRfid = await sql(
    'SELECT student_id FROM students WHERE rfid_tag = $1',
    [rfid_tag]
  );

  if (existingRfid.length > 0 && existingRfid[0].student_id !== student_id) { 
    return res.status(400).json({ message: 'Duplicate RFID tag' });
  }

}

async function deleteStudent(student_id) {
  const deleteResponse = await fetch(`https://vizsgaremek-mocha.vercel.app/api/students/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id }),
  });

  if (!deleteResponse.ok) {
    throw new Error('Failed to delete old student');
  }
}

async function generateStudentGroups(student_id, studentClass) {
  const generateGroups = await fetch(`https://vizsgaremek-mocha.vercel.app/api/students/setStudentGroups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id, studentClass }),
  });

  if (!generateGroups.ok) {
    throw new Error('Failed to generate student groups');
  }
}

//30F822A9