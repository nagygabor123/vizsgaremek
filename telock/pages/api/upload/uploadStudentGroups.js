import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      // Lekérjük az összes diákot
      const students = await sql('SELECT student_id, class FROM students WHERE class IS NOT NULL');
      console.log('Students:', students);

      // Lekérjük az összes csoportot
      const groups = await sql('SELECT group_id, group_name FROM csoportok');
      console.log('Groups:', groups);

      // Felépítjük a beszúrási adatokat
      const insertValues = [];

      students.forEach(student => {
        console.log(`Processing student ${student.student_id} with class:`, student.class);
        const studentClasses = student.class ? student.class.split(',').map(c => c.trim()) : [];

        studentClasses.forEach(className => {
          const group = groups.find(g => g.group_name === className);
          console.log(`Checking className: ${className}, Found group:`, group);
          if (group) {
            insertValues.push([student.student_id, group.group_id]);
          }
        });
      });

      console.log('Insert values:', insertValues);

      if (insertValues.length > 0) {
        const studentIds = insertValues.map(iv => iv[0]);
        const groupIds = insertValues.map(iv => iv[1]);

        await sql(
          'INSERT INTO student_groups (student_id, group_id) SELECT * FROM UNNEST($1::int[], $2::int[])',
          [studentIds, groupIds]
        );

        res.status(201).json({ message: 'Student groups uploaded successfully', inserted: insertValues.length });
      } else {
        res.status(200).json({ message: 'No matching student groups found, nothing inserted.', inserted: 0 });
      }

    } catch (error) {
      console.error('Error inserting student groups:', error);
      res.status(500).json({ message: 'Error inserting student groups', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
