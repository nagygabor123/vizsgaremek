import { connectToDatabase } from '../../../lib/db';
import fs from 'fs';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false, // Mert multiparty-t használunk a fájl kezeléséhez
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

    try {
      const csvData = fs.readFileSync(filePath, 'utf8');
      const rows = csvData.split('\n').filter(row => row.trim() !== '');
      const header = rows.shift().split(',');

      const data = rows.map(row => {
        const values = row.split(',');
        return header.reduce((acc, key, index) => {
          acc[key.trim()] = values[index]?.trim();
          return acc;
        }, {});
      });

      const db = await connectToDatabase();
      const insertQuery = 'INSERT INTO ring_times (`start_time`, `end_time`) VALUES (?, ?)';

      for (let row of data) {
        const { start_time, end_time } = row;
        if (!start_time || !end_time) {
          console.warn('Hiányzó adatok a CSV-ben:', row);
          continue; // Hibás sort kihagyja, nem áll le a teljes import
        }

        try {
          await db.execute(insertQuery, [start_time, end_time]);
        } catch (dbError) {
          console.error(`Hiba az adatbázisba íráskor: ${dbError.message}`);
          return res.status(500).json({ error: 'Adatbázis hiba a feltöltés közben.' });
        }
      }

      return res.status(200).json({ message: 'Csengetési rend sikeresen feltöltve!' });
    } catch (error) {
      console.error('Hiba a fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    }
  });
}
