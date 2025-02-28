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
let baseID = 55555;

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

        const lastName = rowData['Vezeteknev'];
        const firstName = rowData['Utonev'];
        const fullName = `${lastName} ${firstName}`;

        let classGroups = rowData['Csoport']
          ? rowData['Csoport']
              .split(/,/) 
              .map(item => item.trim().replace(/[\s-]+/g, ',')) 
              .filter(item => item.length > 0) 
          : '';

        if (studentMap.has(fullName)) {
          const existingClassGroups = new Set(studentMap.get(fullName).class.split(','));
          classGroups.forEach(group => existingClassGroups.add(group));
          studentMap.get(fullName).class = Array.from(existingClassGroups).join(',');
        } else {
          studentMap.set(fullName, {
            student_id: generateStudentID(),
            full_name: fullName,
            class: classGroups.join(','),
            rfid_tag: generateRFID(),
            access: 'zarva',
          });
        }
      });

      const insertQuery = 'INSERT INTO students (student_id, full_name, class, rfid_tag, access) VALUES (?, ?, ?, ?, ?)';
      for (const student of studentMap.values()) {
        const connection = await pool.getConnection(); // Új kapcsolat
        try {
          await connection.execute(insertQuery, [
            student.student_id,
            student.full_name,
            student.class,
            student.rfid_tag,
            student.access
          ]);
        } catch (dbError) {
          console.error('Adatbázis hiba:', dbError);
          return res.status(500).json({ error: 'Hiba történt az adatok mentésekor' });
        } finally {
          connection.release(); // Kapcsolat visszaadása a poolnak
        }
      }

      return res.status(200).json({ message: 'A diákok sikeresen hozzáadva' });

    } catch (error) {
      console.error('Hiba a fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    }
  });
}
