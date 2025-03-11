import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import multiparty from 'multiparty';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, 
  },
};

const RESERVED_IDS = new Set(["OM11111", "OM22222", "OM33333", "OM44444"]);
let baseID = 7000;
const sql = neon(`${process.env.DATABASE_URL}`);


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak a POST metódus használható' });
  }

  const form = new multiparty.Form({
    maxFieldsSize: 20 * 1024 * 1024,
    maxFilesSize: 50 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Hiba a fájl feldolgozásakor:', err);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozásakor' });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'Nincs fájl feltöltve' });
    }

    try {
      const filePath = file.path;
      const csvData = fs.readFileSync(filePath, 'utf8');

      const rows = csvData.split(/\r?\n/).map(row => row.trim()).filter(row => row.length > 0);
      if (rows.length < 2) {
        return res.status(400).json({ error: 'Üres vagy érvénytelen CSV fájl' });
      }

      const header = rows.shift().split(';').map(h => h.trim());
      const students = [];

      rows.forEach((row) => {
        const values = row.split(';').map(v => v.trim());
        const rowData = header.reduce((acc, key, index) => {
          acc[key] = values[index] || ''; 
          return acc;
        }, {});

        const fullName = rowData['Nev'];
        const studentClass = rowData['Osztalyok'];

        if (!fullName || !studentClass) {
          console.warn('Hiányzó adatok egy sorban:', rowData);
          return; 
        }

        students.push([
          generateStudentID(),
          fullName,
          studentClass,
          generateRFID(),
          'zarva',
        ]);
      });

      console.log(`Összes diák: ${students.length}`);

      // **BATCH INSERT - HELYES FORMÁTUM**
      if (students.length > 0) {
        const values = students.flat();
        const placeholders = students
          .map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
          .join(', ');

        const insertQuery = `INSERT INTO students (student_id, full_name, class, rfid_tag, access) VALUES ${placeholders}`;
        
        await sql(insertQuery, values);
      }

      await checkStudentsInserted(students);
      await UploadStudentGroups();
      await uploadLockerRelations();

      return res.status(200).json({ message: `Sikeresen hozzáadva: ${students.length} diák` });

    } catch (error) {
      console.error('Hiba a fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    }
  });
}


function generateStudentID() {
  while (RESERVED_IDS.has(`OM${baseID}`)) {
    baseID++;
  }
  const id = `OM${baseID}`;
  RESERVED_IDS.add(id);
  baseID++;
  return id;
}

function generateRFID() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function checkStudentsInserted(students) {
  try {
    const studentsInDb = await sql('SELECT student_id FROM students');
    
    console.log('Visszakapott adatok:', studentsInDb); // Logolás

    if (!Array.isArray(studentsInDb)) {
      throw new Error('Az adatbázisból visszakapott eredmény nem egy tömb');
    }

    const insertedStudentIDs = studentsInDb.map(student => student.student_id);

    for (const student of students) {
      if (!insertedStudentIDs.includes(student[0])) {
        throw new Error(`A diák nem került fel az adatbázisba: ${student[0]}`);
      }
    }
  } catch (error) {
    console.error('Hiba az adatbázis lekérdezés közben:', error);
    throw error;
  }
}

async function UploadStudentGroups() {
  try {
    const response = await fetch('https://vizsgaremek-mocha.vercel.app/api/upload/uploadStudentGroups', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Hiba az uploadStudentGroups végpont meghívása közben');
    }
  } catch (error) {
    console.error('Hiba az uploadStudentGroups hívásakor:', error);
  }
}

async function uploadLockerRelations() {
  try {
    const response = await fetch('https://vizsgaremek-mocha.vercel.app/api/upload/uploadStudLockRelations', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Hiba az uploadStudentGroups végpont meghívása közben');
    }
  } catch (error) {
    console.error('Hiba az uploadStudentGroups hívásakor:', error);
  }
}
