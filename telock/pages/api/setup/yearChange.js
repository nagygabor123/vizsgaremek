import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { school_id } = req.query;

    if (!school_id) {
      return res.status(400).json({ error: 'Hiányzó school_id paraméter.' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      // Execute each deletion as a separate query
      await sql('BEGIN');

      // Delete from locker_relationships first
      await sql(
        'DELETE FROM locker_relationships WHERE rfid_tag IN (SELECT rfid_tag FROM students WHERE school_id = $1)',
        [school_id]
      );

      // Delete from student_groups
      await sql(
        'DELETE FROM student_groups WHERE student_id IN (SELECT student_id FROM students WHERE school_id = $1)',
        [school_id]
      );

      // Delete from group_relations
      await sql(
        'DELETE FROM group_relations WHERE timetable_id IN (SELECT timetable_id FROM timetables WHERE school_id = $1)',
        [school_id]
      );

      // Delete from timetables
      await sql('DELETE FROM timetables WHERE school_id = $1', [school_id]);

      // Delete from csoportok
      await sql('DELETE FROM csoportok WHERE school_id = $1', [school_id]);

      // Delete from students
      await sql('DELETE FROM students WHERE school_id = $1', [school_id]);

      // Delete from admins (except rendszergazda)
      await sql(
        "DELETE FROM admins WHERE school_id = $1 AND position != 'rendszergazda'",
        [school_id]
      );

      // Delete from year_schedule (except kezd and veg types)
      await sql(
        "DELETE FROM year_schedule WHERE school_id = $1 AND type NOT IN ('kezd', 'veg')",
        [school_id]
      );

      // Delete from ring_times
      await sql('DELETE FROM ring_times WHERE school_id = $1', [school_id]);

      // Delete unused lockers
      await sql(
        'DELETE FROM lockers WHERE locker_id NOT IN (SELECT locker_id FROM locker_relationships)'
      );

      await sql('COMMIT');
      
      return res.status(200).json({ message: 'Sikeres törlés', schoolId: school_id });
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