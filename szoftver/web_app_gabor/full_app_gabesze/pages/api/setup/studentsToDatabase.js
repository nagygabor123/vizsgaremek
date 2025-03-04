import { connectToDatabase } from '@/lib/db';
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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak a POST metódus használható' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Hiba a CSV fájl feldolgozásakor:', err);
      return res.status(500).json({ error: 'Hiba a CSV fájl feldolgozásakor' });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'Nincs fájl feltöltve' });
    }

    let pool;
    try {
      pool = await connectToDatabase();

      const filePath = file.path;
      const csvData = fs.readFileSync(filePath, 'utf8');
      const rows = csvData.split('\n').filter(Boolean);
      const header = rows.shift().split(';');
      
      const studentMap = new Map();

      rows.forEach((row) => {
        const values = row.split(';');
        const rowData = header.reduce((acc, key, index) => {
          acc[key.trim()] = values[index]?.trim();
          return acc;
        }, {});
      
        const fullName = rowData['Nev'];
        const studentClass = rowData['Osztalyok'];
      
        if (!studentMap.has(fullName)) {
          studentMap.set(fullName, {
            student_id: generateStudentID(),
            full_name: fullName,
            class: studentClass,
            rfid_tag: generateRFID(),
            access: 'zarva',
          });
        }
      });
      
      console.log(`A diákok száma: ${studentMap.size}`);  // Ellenőrzés
      
     // INSERT lekérdezés előkészítése
const insertQuery = 'INSERT INTO students (student_id, full_name, class, rfid_tag, access) VALUES (?, ?, ?, ?, ?)';

for (const student of studentMap.values()) {
  try {
    // A diák beszúrása az adatbázisba
    await pool.execute(insertQuery, [
      student.student_id,
      student.full_name,
      student.class,
      student.rfid_tag,
      student.access,
    ]);
  } catch (dbError) {
    console.error('Adatbázis hiba:', dbError);
    return res.status(500).json({ error: 'Hiba történt az adatok mentésekor' });
  }
}

      

      await checkStudentsInserted(pool, studentMap);
      await triggerUploadStudentGroups();
      
      return res.status(200).json({ message: 'A diákok sikeresen hozzáadva' });

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
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 karakteres RFID
}

async function checkStudentsInserted(pool, studentMap) {
  const studentsInDb = await pool.execute('SELECT student_id FROM students');
  const insertedStudentIDs = studentsInDb[0].map(student => student.student_id);

  // Ellenőrizzük, hogy minden diák felkerült-e
  for (const student of studentMap.values()) {
    if (!insertedStudentIDs.includes(student.student_id)) {
      throw new Error(`A diák nem került fel az adatbázisba: ${student.student_id}`);
    }
  }
}

async function triggerUploadStudentGroups() {
  try {
    const response = await fetch('http://localhost:3000/api/upload/uploadStudentGroups', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Hiba az uploadStudentGroups végpont meghívása közben');
    }
  } catch (error) {
    console.error('Hiba az uploadStudentGroups hívásakor:', error);
  }
}