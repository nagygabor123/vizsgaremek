import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { school_id, type } = req.query;

    if (!type || !school_id) {
      return res.status(400).json({ error: 'Type paraméter szükséges' });
    }
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      let query = '';
      let values = [];

      if (type === 'plusznap') {
        query = 'SELECT year_schedule_id, nev, which_day, replace_day FROM year_schedule WHERE type = $1 AND school_id = $2';
        values = ['plusznap', school_id];
      } else if (type === 'szunet') {
        query = 'SELECT year_schedule_id, type, nev, which_day AS start, replace_day AS end FROM year_schedule WHERE type IN ($1, $2) AND school_id = $3';
        values = ['szunet', 'tanitasnelkul', school_id];
      } else if (type === 'tanitasnelkul') {
        query = 'SELECT year_schedule_id, nev, which_day AS start, replace_day AS end FROM year_schedule WHERE type = $1 AND school_id = $2';
        values = ['tanitasnelkul', school_id];
      } else if (type === 'kezd') {
        query = 'SELECT which_day AS start FROM year_schedule WHERE type = $1 AND school_id = $2 LIMIT 1';
        values = ['kezd', school_id];
      } else if (type === 'veg') {
        query = 'SELECT which_day AS end FROM year_schedule WHERE type = $1 AND school_id = $2 LIMIT 1';
        values = ['veg', school_id];
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
      return res.status(500).json({ error: 'Hiba a lekérdezés során' });
    }
  } else {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }
}
