import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { school_id } = req.query;

    if (!school_id) {
      return res.status(400).json({ error: 'Hiányzó school_id paraméter.' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      await sql('BEGIN');

      console.log('Törlés kezdődik az alábbi school_id-hoz:', school_id);

      await sql(
        'DELETE FROM locker_relationships WHERE rfid_tag IN (SELECT rfid_tag FROM students WHERE school_id = $1)',
        [school_id]
      );

      await sql(
        'DELETE FROM student_groups WHERE student_id IN (SELECT student_id FROM students WHERE school_id = $1)',
        [school_id]
      );

      await sql(
        'DELETE FROM group_relations WHERE timetable_id IN (SELECT timetable_id FROM timetables WHERE school_id = $1)',
        [school_id]
      );

      await sql('DELETE FROM timetables WHERE school_id = $1', [school_id]);
      await sql('DELETE FROM csoportok WHERE school_id = $1', [school_id]);
      await sql('DELETE FROM students WHERE school_id = $1', [school_id]);

      await sql(
        "DELETE FROM admins WHERE school_id = $1 AND position != 'rendszergazda'",
        [school_id]
      );

      await sql(
        "DELETE FROM year_schedule WHERE school_id = $1 AND type NOT IN ('kezd', 'veg')",
        [school_id]
      );

      await sql('DELETE FROM ring_times WHERE school_id = $1', [school_id]);

      await sql(
        'DELETE FROM lockers WHERE locker_id NOT IN (SELECT locker_id FROM locker_relationships)'
      );

      await sql('COMMIT');

      console.log('Törlés sikeresen megtörtént.');

      // Lekérjük a kezdés és vég dátumokat
      const result = await sql(
        "SELECT type, which_day FROM year_schedule WHERE school_id = $1 AND type IN ('kezd', 'veg')",
        [school_id]
      );

      if (result.length !== 2) {
        console.warn('Nem pontosan 2 dátum (kezd és veg) érkezett vissza:', result);
        return res.status(500).json({ error: 'Tanév kezdés/vég dátum hiányos vagy hibás.' });
      }

      for (const row of result) {
        const originalDate = new Date(row.which_day);
        const updatedDate = new Date(originalDate);
        updatedDate.setFullYear(originalDate.getFullYear() + 1);

        console.log(`Frissített ${row.type} dátum:`, updatedDate.toISOString());

        try {
          await callSetYearStartEnd(school_id, row.type, updatedDate);
          console.log(`${row.type} dátum sikeresen beállítva:`, updatedDate.toISOString());
        } catch (apiError) {
          console.error(`Hiba a ${row.type} dátum beállítása közben:`, apiError);
          return res.status(500).json({
            error: `Hiba a ${row.type} dátum újraállításakor.`,
            details: apiError.message
          });
        }
      }

      return res.status(200).json({
        message: 'Sikeres törlés és tanév dátumok frissítése',
        schoolId: school_id
      });

    } catch (error) {
      console.error('Adatbázis hiba:', error);
      await sql('ROLLBACK').catch(e => console.error('Rollback failed:', e));
      return res.status(500).json({
        error: 'Hiba a törlés során',
        details: error.message
      });
    }
  } else {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }
}

async function callSetYearStartEnd(school_id, type, date) {
  console.log(`API hívás indul: ${type} - ${date.toISOString()}`);
  const response = await fetch(`https://telock.vercel.app/api/config/setYearStartEnd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      school_id,
      type,
      which_day: date.toISOString()
    })
  });

  const responseText = await response.text();
  console.log(`API válasz (${type}):`, response.status, responseText);

  if (!response.ok) {
    throw new Error(`setYearStartEnd hívás sikertelen (${type}): ${response.statusText}`);
  }
}
