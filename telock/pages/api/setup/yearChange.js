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

      const result = await sql(
        "SELECT type, date FROM year_schedule WHERE school_id = $1 AND type IN ('kezd', 'veg')",
        [school_id]
      );

      let startDate = null;
      let endDate = null;

      result.forEach(row => {
        if (row.type === 'kezd') startDate = new Date(row.date);
        if (row.type === 'veg') endDate = new Date(row.date);
      });

      if (startDate && endDate) {
        await callSetYearStartEnd(school_id, startDate, endDate);
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

async function callSetYearStartEnd(school_id, startDate, endDate) {
  const newStart = new Date(startDate);
  const newEnd = new Date(endDate);
  newStart.setFullYear(newStart.getFullYear() + 1);
  newEnd.setFullYear(newEnd.getFullYear() + 1);

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/setYearStartEnd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      school_id,
      kezd: newStart.toISOString(),
      veg: newEnd.toISOString()
    })
  });

  if (!response.ok) {
    throw new Error(`setYearStartEnd hívás sikertelen: ${response.statusText}`);
  }
}