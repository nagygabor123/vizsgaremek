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
      console.error('Hiba a csv fájl elemzésekor:', err);
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

      // Ellenőrizzük, hogy a CSV fájl csak a "group_name" oszlopot tartalmazza
      if (header.length !== 1 || header[0] !== 'group_name') {
        return res.status(400).json({ error: 'Hibás formátum! A CSV fájlnak csak a "group_name" oszlopot kell tartalmaznia.' });
      }

      // Az adatok feldolgozása
      const data = rows.map(row => {
        const values = row.split(',');
        return { group_name: values[0]?.trim() };  // Csak group_name értékek
      });

      db = await connectToDatabase();
      const insertQuery = 'INSERT INTO groups (`group_name`) VALUES (?)';

      for (let row of data) {
        const { group_name } = row;
        if (!group_name) {
          console.warn('Hiányzó adat a CSV-ben:', row);
          continue; // Ha nincs csoportnév, átugorjuk
        }

        try {
          await db.execute(insertQuery, [group_name]);  // Csak group_name kerül beillesztésre
        } catch (dbError) {
          console.error(`Hiba az adatbázisba íráskor: ${dbError.message}`);
          return res.status(500).json({ error: 'Adatbázis hiba a feltöltés közben.' });
        }
      }

      return res.status(200).json({ message: 'Órák sikeresen feltöltve a groups táblába!' });
    } catch (error) {
      console.error('Hiba a fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    } finally {
      if (db) {
        await db.end(); // Az adatbázis kapcsolat bezárása
      }
    }
  });
}
