import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { student } = req.query;

  if (!student) {
    return res.status(400).json({ message: "Missing student identifier" });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Beállítjuk az "access" mezőt "nyithato"-ra és az "expires_at"-ot 5 perccel későbbre
    const updateResult = await sql(
      `UPDATE students 
       SET access = $1, expires_at = NOW() + INTERVAL '3 minutes' 
       WHERE student_id = $2`,
      ['nyithato', student]
    );

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ 
      message: `Student ${student} access updated to nyithato. It will be reset in 5 minutes.` 
    });
  } catch (error) {
    console.error("Error updating access state:", error);
    return res.status(500).json({ message: "Failed to update access state" });
  }
}
