import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      const { student_id, classNames } = req.body;

      if (!student_id || !Array.isArray(classNames) || classNames.length === 0) {
        return res.status(400).json({ message: 'Student ID and class names are required.' });
      }

      // Lekérdezzük az összes csoportot
      const groups = await sql('SELECT group_id, group_name FROM csoportok');
      
      const insertValues = classNames
        .map(className => {
          const group = groups.find(g => g.group_name === className);
          return group ? [student_id, group.group_id] : null;
        })
        .filter(Boolean); // Eltávolítja a null értékeket, ha nincs megfelelő csoport

      if (insertValues.length > 0) {
        const groupIds = insertValues.map(iv => iv[1]);

        // Először töröljük a régi kapcsolatokat a student_groups táblából
        await sql('DELETE FROM student_groups WHERE student_id = $1', [student_id]);

        // Beszúrjuk az új csoportokat
        await sql(
          'INSERT INTO student_groups (student_id, group_id) SELECT * FROM UNNEST($1::int[], $2::int[])',
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
