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
      if (header.length !== 5 || header[0] !== 'group_id' || header[1] !== 'admin_id' || header[2] !== 'day_of_week' || header[3] !== 'start_time' || header[4] !== 'end_time') {
        return res.status(400).json({ error: 'Hibás formátum! A CSV fájlnak a "group_id", "admin_id", "day_of_week", "start_time", "end_time" oszlopokat kell tartalmaznia.' });
      }

      // Az adatok feldolgozása
      const data = rows.map(row => {
        const values = row.split(',');
        return { 
          group_id: parseInt(values[0]?.trim()), 
          admin_id: parseInt(values[1]?.trim()), 
          day_of_week: values[2]?.trim().toLowerCase(),
          start_time: values[3]?.trim(),
          end_time: values[4]?.trim() 
        };
      });

      db = await connectToDatabase();
      const insertQuery = 'INSERT INTO timetables (`group_id`, `admin_id`, `day_of_week`, `start_time`, `end_time`) VALUES (?, ?, ?, ?, ?)';

      for (let row of data) {
        const { group_id, admin_id, day_of_week, start_time, end_time } = row;
        if (!group_id || !admin_id || !day_of_week || !start_time || !end_time) {
          console.warn('Hiányzó adat a CSV-ben:', row);
          continue;
        }

        try {
          await db.execute(insertQuery, [group_id, admin_id, day_of_week, start_time, end_time]);  // adatok beillesztése a timetables táblába
        } catch (dbError) {
          console.error(`Hiba az adatbázisba íráskor: ${dbError.message}`);
          return res.status(500).json({ error: 'Adatbázis hiba a feltöltés közben.' });
        }
      }

      return res.status(200).json({ message: 'Adatok sikeresen feltöltve a timetables táblába!' });
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
