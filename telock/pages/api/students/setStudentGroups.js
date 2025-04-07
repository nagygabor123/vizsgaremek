import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { student_id } = req.query;
    if (!student_id) {
      return res.status(400).json({ message: 'Hiányzó student_id' });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    try {
      
      const student = await sql('SELECT student_id, class, school_id FROM students WHERE student_id = $1', [student_id]);
      if (student.length === 0) {
        return res.status(404).json({ message: 'A diák nem található' });
      }
      console.log('Student:', student[0]);

      await sql('DELETE FROM student_groups WHERE student_id = $1', [student_id]);
      console.log(`Deleted existing entries for student_id: ${student_id}`);

      const groups = await sql('SELECT group_id, group_name FROM csoportok WHERE school_id = $1', [student[0].school_id]);
      console.log('Csoportok:', groups);
      const insertValues = [];
      const studentClasses = student[0].class ? student[0].class.split(',').map(c => c.trim()) : [];
      
      studentClasses.forEach(className => {
        const group = groups.find(g => g.group_name === className);
        console.log(`ClassName ellenőrzés: ${className}, Talált csoport:`, group);
        if (group) {
          insertValues.push([student[0].student_id, group.group_id]);
        }
      });
      console.log('Feltöltendő adat:', insertValues);

      if (insertValues.length > 0) {
        const studentIds = insertValues.map(iv => iv[0]);
        const groupIds = insertValues.map(iv => iv[1]);

        await sql(
          'INSERT INTO student_groups (student_id, group_id) SELECT * FROM UNNEST($1::text[], $2::int[])',
          [studentIds, groupIds]
        );

        res.status(201).json({ message: 'Sikeres csoportba rendezés', inserted: insertValues.length });
      } else {
        res.status(200).json({ message: 'Nem találtam csoport egyezést', inserted: 0 });
      }
    } catch (error) {
      console.error('Hiba az adatok feltöltésénél:', error);
      res.status(500).json({ message: 'Hiba az adatok feltöltésekor', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'A metódus nem követhető' });
  }
}