import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      // Lekérjük az összes diákot
      const students = await sql('SELECT student_id, class FROM students WHERE class IS NOT NULL');

      // Lekérjük az összes csoportot
      const groups = await sql('SELECT group_id, group_name FROM csoportok');

      // Felépítjük a beszúrási adatokat
      const insertValues = [];

      students.forEach(student => {
        const studentClasses = student.class ? student.class.split(',').map(c => c.trim()) : [];

        studentClasses.forEach(className => {
          const group = groups.find(g => g.group_name === className);
          if (group) {
            insertValues.push([student.student_id, group.group_id]);
          }
        });
      });

      if (insertValues.length > 0) {
        const studentIds = insertValues.map(iv => iv[0]);
        const groupIds = insertValues.map(iv => iv[1]);
      
        await sql(
          'INSERT INTO student_groups (student_id, group_id) SELECT * FROM UNNEST($1::int[], $2::int[]) ON CONFLICT (student_id, group_id) DO NOTHING',
          [studentIds, groupIds]
        );
      }

      res.status(201).json({ message: 'Student groups uploaded successfully', inserted: insertValues.length });
    } catch (error) {
      console.error('Error inserting student groups:', error);
      res.status(500).json({ message: 'Error inserting student groups', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}