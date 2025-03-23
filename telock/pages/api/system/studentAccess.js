import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "A HTTP metódus nem engedélyezett" });
  }

  const { student } = req.query;

  if (!student) {
    return res.status(400).json({ message: "'student_id' hiányzik" });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql(
      `UPDATE students 
       SET access = $1 
       WHERE student_id = $2`,
      ['nyithato', student]
    );

    return res.status(200).json({ 
      message: `${student} diák 'access' frissítve nyithato-ra` 
    });
  } catch (error) {
    console.error("Hiba az adatok feltöltésekor:", error);
    return res.status(500).json({ message: "Hiba az adatok feltöltésekor" });
  }
}