import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      const students = await sql('SELECT student_id, class FROM students WHERE class IS NOT NULL');
      console.log('Diákok:', students);
      const groups = await sql('SELECT group_id, group_name FROM csoportok');
      console.log('Csoportok:', groups);
      const insertValues = [];

      students.forEach(student => {
        console.log(`Diák ${student.student_id} feldolgozása osztállyal:`, student.class);
        const studentClasses = student.class ? student.class.split(',').map(c => c.trim()) : [];

        studentClasses.forEach(className => {
          const group = groups.find(g => g.group_name === className);
          console.log(`ClassName ellenőrzés: ${className}, Talált csoport:`, group);
          if (group) {
            insertValues.push([student.student_id, group.group_id]);
          }
        });
      });

      console.log('Feltöltendő adat:', insertValues);

      if (insertValues.length > 0) {
        const studentIds = insertValues.map(iv => iv[0]);
        const groupIds = insertValues.map(iv => iv[1]);

        await sql(
          'INSERT INTO student_groups (student_id, group_id) SELECT * FROM UNNEST($1::text[], $2::int[])',
          [studentIds, groupIds]
        );

        res.status(201).json({ message: 'Diák-csoportok sikeresen feltöltve', inserted: insertValues.length });
      } else {
        res.status(200).json({ message: 'Nem találtak megfelelő diákcsoportokat, semmi sem került beillesztésre.', inserted: 0 });
      }

    } catch (error) {
      console.error('Hiba az adatok feltöltésekor:', error);
      res.status(500).json({ message: 'Hiba az adatok feltöltésekor', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}
