import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "A HTTP metódus nem engedélyezett" });
  }

  const { students } = req.body;

  if (!Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "'students' tömb szükséges" });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql(
      `UPDATE students 
       SET access = 'nyithato' 
       WHERE student_id = ANY($1)`,
      [students]
    );

    return res.status(200).json({ 
      message: `A megadott ${students.length} diákok 'access' frissítve 'nyitható'-ra` 
    });
  } catch (error) {
    console.error("Hiba az adatok frissítésekor:", error);
    return res.status(500).json({ message: "Hiba az adatok frissítésekor" });
  }
}
