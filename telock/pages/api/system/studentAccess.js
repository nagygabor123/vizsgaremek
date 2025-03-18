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
    const now = new Date();
    const budapestTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Europe/Budapest' })
    );
    
    budapestTime.setMinutes(budapestTime.getMinutes() + 5);
    const expiresAt = budapestTime.toISOString().slice(0, 19).replace("T", " ");
    
    const updateResult = await sql(
      `UPDATE students 
       SET access = $1, expires_at = $2 
       WHERE student_id = $3`,
      ['nyithato', expiresAt, student]
    );
    
  
    if (updateResult.rowCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }
  
    return res.status(200).json({ 
      message: `Student ${student} access updated to nyithato. It will reset to zarva at ${expiresAt}.` 
    });
  } catch (error) {
    console.error("Error updating access state:", error);
    return res.status(500).json({ message: "Failed to update access state" });
  }
  
  
}