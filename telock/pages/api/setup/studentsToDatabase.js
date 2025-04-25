import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import multiparty from 'multiparty';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

let baseID = 7000;
const sql = neon(`${process.env.DATABASE_URL}`);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'A metódus nem követhető' });
  }
  const { school_id } = req.query;
  console.log(school_id);
  const form = new multiparty.Form({
    maxFieldsSize: 20 * 1024 * 1024,
    maxFilesSize: 50 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Hiba a fájl feldolgozása közben:', err);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'Hiba a fájl feltöltésekor!' });
    }

    try {
      const filePath = file.path;
      const csvData = fs.readFileSync(filePath, 'utf8');

      const rows = csvData.split(/\r?\n/).map(row => row.trim()).filter(row => row.length > 0);
      if (rows.length < 2) {
        return res.status(400).json({ error: 'Üres vagy érvénytelen CSV fájl!' });
      }

      const header = rows.shift().split(';').map(h => h.trim());
      const students = [];

      rows.forEach((row, index) => {
        const values = row.split(';').map(v => v.trim());
        const rowData = header.reduce((acc, key, idx) => {
          acc[key] = values[idx] || '';
          return acc;
        }, {});
      
        const fullName = rowData['Nev'];
        const studentClass = rowData['Osztalyok'];
      
        if (!fullName || !studentClass) {
          console.warn('Hiányzó adatok egy sorban:', rowData);
          return;
        }
      
        let rfid;
        if (index === 0) {
          rfid = 'F7F59C7A';
        } else if (index === 1) {
          rfid = 'DA6BD581';
        } else {
          rfid = generateRFID();
        }
      
        students.push([
          generateStudentID(),
          fullName,
          studentClass,
          rfid,
          'zarva',
          school_id
        ]);
      });
      

      console.log(`Összes diák: ${students.length}`);

      if (students.length > 0) {
        const values = students.flat();
        const placeholders = students
          .map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`)
          .join(', ');

        const insertQuery = `INSERT INTO students (student_id, full_name, class, rfid_tag, access, school_id) VALUES ${placeholders}`;

        await sql(insertQuery, values);
      }

      await checkStudentsInserted(students, school_id);
      await UploadStudentGroups(school_id);
      await uploadLockerRelations();

      return res.status(200).json({ message: `Sikeresen hozzáadva: ${students.length} diák` });

    } catch (error) {
      console.error('Hiba a fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    }
  });
}

function generateStudentID() {
  const id = `OM${baseID}`;
  baseID++;
  return id;
}

function generateRFID() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

async function checkStudentsInserted(students, school_id) {
  try {
    const studentsInDb = await sql(`SELECT student_id FROM students WHERE school_id = ${school_id}`);

    console.log('Visszakapott adatok:', studentsInDb);

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

async function UploadStudentGroups(school_id) {
  try {
    const response = await fetch(`https://telock.vercel.app/api/upload/uploadStudentGroups?school_id=${school_id}`, {
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
    const response = await fetch('https://telock.vercel.app/api/upload/uploadStudLockRelations', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Hiba az uploadStudentGroups végpont meghívása közben');
    }
  } catch (error) {
    console.error('Hiba az uploadStudentGroups hívásakor:', error);
  }
}
