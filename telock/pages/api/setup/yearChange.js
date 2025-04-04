import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const { school_id } = req.query;

    if (!school_id) {
      return res.status(400).json({ error: 'Hiányzó school_id paraméter.' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const cleanupSQL = `
      DO $$
      DECLARE
        target_school_id INT := $1; 
      BEGIN
        DELETE FROM locker_relationships 
        WHERE rfid_tag IN (SELECT rfid_tag FROM students WHERE school_id = target_school_id);
        
        DELETE FROM student_groups 
        WHERE student_id IN (SELECT student_id FROM students WHERE school_id = target_school_id);
        
        DELETE FROM group_relations 
        WHERE timetable_id IN (SELECT timetable_id FROM timetables WHERE school_id = target_school_id);
        
        DELETE FROM timetables WHERE school_id = target_school_id;
        
        DELETE FROM csoportok WHERE school_id = target_school_id;
        
        DELETE FROM students WHERE school_id = target_school_id;
        
        DELETE FROM admins 
        WHERE school_id = target_school_id AND position != 'rendszergazda';
        
        DELETE FROM year_schedule 
        WHERE school_id = target_school_id AND type NOT IN ('kezd', 'veg');
        
        DELETE FROM ring_times WHERE school_id = target_school_id;
        
        DELETE FROM lockers 
        WHERE locker_id NOT IN (SELECT locker_id FROM locker_relationships);
      END $$;
    `;

    try {
      await sql(cleanupSQL, [school_id]);
      return res.status(200).json({ message: 'Sikeres törlés', schoolId: school_id });
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      return res.status(500).json({ error: 'Hiba a törlés során' });
    }
  } else {
    return res.status(405).json({ error: 'A HTTP metódus nem engedélyezett' });
  }
}
