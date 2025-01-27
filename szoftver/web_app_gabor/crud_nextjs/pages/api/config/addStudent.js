import { connectToDatabase } from '../../../lib/db';
import fs from 'fs';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false, // Le kell tiltani a Next.js alapértelmezett bodyParser-t
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  // Fájl feltöltése a multiparty segítségével
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the form:', err);
      return res.status(500).json({ error: 'Error parsing the form' });
    }

    // A fájl elérési útja
    const file = files.file[0]; // Az első fájlt vesszük
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      // A fájl elérési útja
      const filePath = file.path;
      const csvData = fs.readFileSync(filePath, 'utf8');

      // CSV fájl feldolgozása
      const rows = csvData.split('\n').filter(Boolean);
      const header = rows.shift().split(',');

      const data = rows.map((row) => {
        const values = row.split(',');
        return header.reduce((acc, key, index) => {
          acc[key.trim()] = values[index]?.trim();
          return acc;
        }, {});
      });

      // Adatok beszúrása az adatbázisba
      const db = await connectToDatabase(); // Csatlakozás az adatbázishoz
      const insertQuery = 'INSERT INTO students (`student_id`, `full_name`, `class`, `rfid_tag`, `access`) VALUES (?, ?, ?, ?, ?)';
      
      for (let student of data) {
        const { student_id, full_name, class: studentClass, rfid_tag, access } = student;

        if (!student_id || !full_name || !studentClass || !rfid_tag) {
          return res.status(400).json({ message: 'Missing required fields for a student' });
        }

        const accessValue = access || 'nyitva';

        try {
          await db.execute(insertQuery, [student_id, full_name, studentClass, rfid_tag, accessValue]);
        } catch (dbError) {
          if (dbError.code === 'ER_DUP_ENTRY') {
            console.warn(`Duplicate entry: ${student_id}`);
            return res.status(400).json({
              message: `Duplicate entry found for student ID: ${student_id}. This record already exists.`,
            });
          } else {
            throw dbError; // Más adatbázis hiba esetén dobjuk tovább
          }
        }
      }

      return res.status(200).json({ message: 'Students added successfully' });
    } catch (error) {
      console.error('Error processing the file:', error);
      return res.status(500).json({ error: 'Failed to process the file' });
    }
  });
}
