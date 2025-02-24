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

      // Csengetési rend kinyerése
      const ringing = extractRingingSchedule(parsedXml);
      console.log(ringing);

      // Küldje el az adatokat a /api/config/addRinging végpontra
      await sendRingingData(ringing);

      return res.status(200).json({
        message: 'XML adatok sikeresen feldolgozva és továbbítva!',
        ringing,
      });
    } catch (error) {
      console.error('Hiba az XML fájl feldolgozása közben:', error);
      return res.status(500).json({ error: 'Hiba a fájl feldolgozása közben' });
    }
  });
}

function extractRingingSchedule(parsedXml) {
  if (!parsedXml.timetable || !parsedXml.timetable.periods || !parsedXml.timetable.periods[0].period) {
    return [];
  }

  return parsedXml.timetable.periods[0].period.map(p => ({
    start_time: p.$.starttime,
    end_time: p.$.endtime,
  }));
}

async function sendRingingData(ringing) {
  try {
    const response = await fetch('http://localhost:3000/api/config/addRinging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ringing }),
    });

    if (!response.ok) {
      throw new Error(`Hiba a ringing adatok továbbításakor: ${response.statusText}`);
    }

    console.log('Ringing adatok sikeresen továbbítva!');
  } catch (error) {
    console.error('Hiba a ringing adatok küldése közben:', error);
  }
}
