import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      const { student_id, classNames } = req.body;

      if (!student_id || !classNames || !Array.isArray(classNames)) {
        return res.status(400).json({ message: 'Student ID and class names are required.' });
      }

      const groups = await sql('SELECT group_id, group_name FROM csoportok');
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
        const groupIds = insertValues.map(iv => iv[1]);

        await sql('DELETE FROM student_groups WHERE student_id = $1', [student_id]);

        await sql(
          'INSERT INTO student_groups (student_id, group_id) SELECT * FROM UNNEST($1::text[], $2::int[])',
          [Array(insertValues.length).fill(student_id), groupIds]
        );
      }

      res.status(200).json({ message: 'Student groups updated successfully', inserted: insertValues.length });
    } catch (error) {
      console.error('Error updating student groups:', error);
      res.status(500).json({ message: 'Error updating student groups', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
