import { connectToDatabase } from '../../../lib/db';
import fs from 'fs';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Csak a POST metódus használható' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Hiba a fájl elemzésekor:', err);
      return res.status(400).json({ error: 'Hiba a fájl feltöltésekor, ellenőrizd a formátumot!' });
    }

    if (!files || !files.file || files.file.length === 0) {
      return res.status(400).json({ error: 'Nincs fájl feltöltve' });
    }

    const file = files.file[0];
    const filePath = file.path;

    let db;
    try {
      const csvData = fs.readFileSync(filePath, 'utf8');
      const rows = csvData.split('\n').filter(row => row.trim() !== '');

      // Az első sor (fejléc) eltávolítása és ellenőrzése
      const header = rows.shift().split(',').map(h => h.trim());

      // Ellenőrizzük, hogy a CSV fájl a megfelelő formátumot tartalmazza
      if (header.length !== 2 || header[0] !== 'student_id' || header[1] !== 'group_id') {
        return res.status(400).json({ error: 'Hibás formátum! A CSV fájlnak a "student_id" és "group_id" oszlopokat kell tartalmaznia.' });
      }

      // Az adatok feldolgozása
      const data = rows.map(row => {
        const values = row.split(',');
        return { student_id: values[0]?.trim(), group_id: parseInt(values[1]?.trim()) };  // student_id és group_id értékek
      });

      db = await connectToDatabase();
      const insertQuery = 'INSERT INTO student_groups (`student_id`, `group_id`) VALUES (?, ?)';

      for (let row of data) {
        const { student_id, group_id } = row;
        if (!student_id || !group_id) {
          console.warn('Hiányzó adat a CSV-ben:', row);
          continue; // Ha nincs student_id vagy group_id, átugorjuk
        }

        try {
          await db.execute(insertQuery, [student_id, group_id]);  // student_id és group_id beillesztése
        } catch (dbError) {
          console.error(`Hiba az adatbázisba íráskor: ${dbError.message}`);
          return res.status(500).json({ error: 'Adatbázis hiba a feltöltés közben.' });
        }
      }

      return res.status(200).json({ message: 'Adatok sikeresen feltöltve a student_groups táblába!' });
    } catch (error) {
      console.error('Hiba a fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    } finally {
      if (db) {
        await db.end(); 
      }
    }
  });
}
