import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const db = await connectToDatabase();

    try {
      // Lekérjük az összes diákot
      const [students] = await db.query(`SELECT student_id, class FROM students WHERE class IS NOT NULL;`);

      // Lekérjük az összes csoportot
      const [groups] = await db.query(`SELECT group_id, group_name FROM groups;`);

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
        await db.query(
          `INSERT IGNORE INTO student_groups (student_id, group_id) VALUES ?;`,
          [insertValues]
        );
      }

      res.status(201).json({ message: 'Student groups uploaded successfully', inserted: insertValues.length });
    } catch (error) {
      console.error('Error inserting student groups:', error);
      res.status(500).json({ message: 'Error inserting student groups', error: error.message });
    } finally {
      await db.end();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
