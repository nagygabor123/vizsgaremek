
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
import { neon } from '@neondatabase/serverless';
    
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { student_id, full_name, class: studentClass, rfid_tag } = req.body;

    if (!student_id || !full_name || !studentClass || !rfid_tag) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      await sql(
        'INSERT INTO students (student_id, full_name, class, rfid_tag, access) VALUES ($1, $2, $3, $4, $5);', 
        [student_id, full_name, studentClass, rfid_tag, 'zarva'] // Ide adj megfelelő alapértelmezett értéket
      );
      

      const maxLocker = await sql('SELECT MAX(locker_id) AS max_id FROM lockers;');
      let nextLockerId = maxLocker.length > 0 && maxLocker[0].max_id ? maxLocker[0].max_id + 1 : 8;

      await sql('INSERT INTO lockers (locker_id, status) VALUES ($1, $2);', [nextLockerId, 'ki']);
      await sql('INSERT INTO locker_relationships (rfid_tag, locker_id) VALUES ($1, $2);', [rfid_tag, nextLockerId]);
      const result = await setStudentGroups(student_id);
      console.log('Student groups: ', result);
      res.status(201).json({ message: 'Student and locker relationship created', locker_id: nextLockerId });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ message: 'Error creating student and locker relationship', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}


async function setStudentGroups(student_id) {
  const url = `https://vizsgaremek-mocha.vercel.app/api/students/setStudentGroups?student_id=${student_id}`;

  try {
    const response = await fetch(url, {
      method: 'POST', // A kérés metódusa POST
      headers: {
        'Content-Type': 'application/json', // A kérés fejléce
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // A válasz JSON formátumban
    console.log('Response:', data);
    return data; // Visszaadjuk a választ
  } catch (error) {
    console.error('Error calling setStudentGroups:', error);
    throw error; // Hibát dobunk, ha valami elromlik
  }
}

