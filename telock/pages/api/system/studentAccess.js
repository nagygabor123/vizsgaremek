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
    await sql(
      `UPDATE students 
       SET access = $1 
       WHERE student_id = $2`,
      ['nyithato', student]
    );

    return res.status(200).json({ 
      message: `Student ${student} access updated to nyithato.` 
    });
  } catch (error) {
    console.error("Error updating access state:", error);
    return res.status(500).json({ message: "Failed to update access state" });
  }
}