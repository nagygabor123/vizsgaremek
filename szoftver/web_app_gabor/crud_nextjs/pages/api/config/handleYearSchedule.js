/*
SELECT * FROM year_schedule WHERE type = 'plusznap';
*/ 

/*
SELECT 
    year_schedule_id, 
    type, 
    nev, 
    which_day AS start, 
    replace_day AS end 
FROM year_schedule 
WHERE type = 'szunet';
*/

import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: 'Type paraméter szükséges' });
    }

    try {
      const connection = await connectToDatabase();
      
      let query = '';
      let values = [];

      if (type === 'plusznap') {
        query = 'SELECT which_day, replace_day FROM year_schedule WHERE type = ?';
        values = ['plusznap'];
      } else if (type === 'szunet') {
        query = 'SELECT which_day AS start, replace_day AS end FROM year_schedule WHERE type = ?';
        values = ['szunet'];
      } else {
        return res.status(400).json({ error: 'Érvénytelen type paraméter' });
      }

      const [rows] = await connection.execute(query, values);

      if (rows.length > 0) {
        if (type === 'plusznap') {
          // Plusznapok átalakítása a kívánt struktúrába
          const plusDates_alap = rows.map(row => ({
            date: row.which_day,
            replaceDay: row.replace_day
          }));
          return res.status(200).json({ plusDates_alap });
        } else if (type === 'szunet') {
          // Szünetek átalakítása a kívánt struktúrába
          const breakDates_alap = rows.map(row => ({
            start: row.start,
            end: row.end
          }));
          return res.status(200).json({ breakDates_alap });
        }
      } else {
        return res.status(404).json({ error: 'Nincs találat' });
      }
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    }
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}
//GET http://localhost:3000/api/config/handleYearSchedule?type=szunet
//GET http://localhost:3000/api/config/handleYearSchedule?type=plusznap

