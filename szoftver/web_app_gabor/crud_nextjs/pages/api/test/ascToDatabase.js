import fs from 'fs';
import multiparty from 'multiparty';
import { parseStringPromise } from 'xml2js';

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
      console.error('Hiba az XML fájl feldolgozása közben:', err);
      return res.status(400).json({ error: 'Hiba a fájl feltöltésekor!' });
    }

    if (!files || !files.file || files.file.length === 0) {
      return res.status(400).json({ error: 'Nincs fájl feltöltve' });
    }

    const file = files.file[0];
    const filePath = file.path;

    try {
      const xmlData = fs.readFileSync(filePath, 'utf8');
      const parsedXml = await parseStringPromise(xmlData);

      return res.status(200).json({
        message: 'XML adatok sikeresen feldolgozva!',
        data: parsedXml.timetable
      });
    } catch (error) {
      console.error('Hiba az XML fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    }
  });
}
