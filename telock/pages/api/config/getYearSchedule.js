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
/**
 * @swagger
 * /api/config/getYearSchedule:
 *   get:
 *     summary: "Lekérdezi az iskolai évhez tartozó adatokat"
 *     description: "Ez az API végpont lehetővé teszi a különböző típusú iskolai év adatainak lekérdezését, például a plusznapok, szünetek, kezdő és záró dátumok."
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         description: "A lekérdezett adat típusát adja meg."
 *         schema:
 *           type: string
 *           enum: [plusznap, szunet, kezd, veg]
 *     tags:
 *       - Configuration
 *     responses:
 *       200:
 *         description: "A kért adat sikeresen vissza lett adva."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 plusDates_alap:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                       replaceDay:
 *                         type: string
 *                 breakDates_alap:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       start:
 *                         type: string
 *                         format: date
 *                       end:
 *                         type: string
 *                         format: date
 *                 schoolYearStart:
 *                   type: object
 *                   properties:
 *                     start:
 *                       type: string
 *                       format: date
 *                 schoolYearEnd:
 *                   type: object
 *                   properties:
 *                     end:
 *                       type: string
 *                       format: date
 *       400:
 *         description: "Érvénytelen 'type' paraméter."
 *       404:
 *         description: "Nincs találat a kért típusú adatra."
 *       500:
 *         description: "Adatbázis csatlakozási hiba történt."
 */
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: 'Type paraméter szükséges' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      let query = '';
      let values = [];

      if (type === 'plusznap') {
        query = 'SELECT year_schedule_id, nev, which_day, replace_day FROM year_schedule WHERE type = $1';
        values = ['plusznap'];
      } else if (type === 'szunet') {
        query = 'SELECT year_schedule_id, type, nev, which_day AS start, replace_day AS end FROM year_schedule WHERE type IN ($1, $2)';
        values = ['szunet', 'tanitasnelkul'];
      } else if (type === 'tanitasnelkul') {
        query = 'SELECT year_schedule_id, nev, which_day AS start, replace_day AS end FROM year_schedule WHERE type = $1';
        values = ['tanitasnelkul'];
      } else if (type === 'kezd') {
        query = 'SELECT which_day AS start FROM year_schedule WHERE type = $1 LIMIT 1';
        values = ['kezd'];
      } else if (type === 'veg') {
        query = 'SELECT which_day AS end FROM year_schedule WHERE type = $1 LIMIT 1';
        values = ['veg'];
      } else {
        return res.status(400).json({ error: 'Érvénytelen type paraméter' });
      }

      const rows = await sql(query, values);

      if (rows.length > 0) {
        if (type === 'plusznap') {
          const plusDates_alap = rows.map(row => ({
            id: row.year_schedule_id, 
            name: row.nev,  
            date: row.which_day,
            replaceDay: row.replace_day
          }));
          return res.status(200).json({ plusDates_alap });
        } else if (type === 'szunet') {
          const breakDates_alap = rows.map(row => ({
            id: row.year_schedule_id, 
            type: row.type,
            name: row.nev,  
            start: row.start,
            end: row.end
          }));
          return res.status(200).json({ breakDates_alap });
        } else if (type === 'tanitasnelkul') {
          const tanitasnelkul_alap = rows.map(row => ({
            id: row.year_schedule_id, 
            name: row.nev,  
            start: row.start,
            end: row.end
          }));
          return res.status(200).json({ tanitasnelkul_alap });
        } else if (type === 'kezd') {
          return res.status(200).json({ schoolYearStart: rows[0] });
        } else if (type === 'veg') {
          return res.status(200).json({ schoolYearEnd: rows[0] });
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

