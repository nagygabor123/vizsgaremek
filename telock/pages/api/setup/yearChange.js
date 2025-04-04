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

      // Lekérjük a kezd és veg időpontokat
      const result = await sql(
        "SELECT type, which_day FROM year_schedule WHERE school_id = $1 AND type IN ('kezd', 'veg')",
        [school_id]
      );

      for (const row of result) {
        const newDate = new Date(row.which_day);
        newDate.setFullYear(newDate.getFullYear() + 1);

        await callSetYearStartEnd(school_id, row.type, newDate);
      }

      return res.status(200).json({ message: 'Sikeres törlés és év újraindítás', schoolId: school_id });

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
  const response = await fetch(`https://vizsgaremek-mocha.vercel.app/api/config/setYearStartEnd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      school_id,
      type,
      date: date.toISOString()
    })
  });

  if (!response.ok) {
    throw new Error(`setYearStartEnd hívás sikertelen: ${response.statusText}`);
  }
}
