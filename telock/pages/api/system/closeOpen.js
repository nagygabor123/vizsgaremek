import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, school_id } = req.body;
    console.log(req.body);

    if (action !== 'close' && action !== 'open') {
      return res.status(400).json({ message: "Érvénytelen 'action'. Az 'action' csak 'close' vagy 'open' értéket fogadhat el." });
    }

    const sql = neon(process.env.DATABASE_URL);
    const newAccessState = action === 'close' ? 'zarva' : 'nyithato';

    try {
      await sql('UPDATE students SET access = $1 WHERE school_id = $2', [newAccessState, school_id]);
      await sql('UPDATE schools SET status = $1 WHERE school_id = $2', [newAccessState, school_id]);

      return res.status(200).json({ message: `Az összes diák 'access' mezője és a 'status' ${newAccessState} (-ra) frissítve` });
    } catch (error) {
      console.error("Nem sikerült frissíteni az 'access' és 'status' állapotot:", error);
      return res.status(500).json({ message: "Nem sikerült frissíteni az 'access' és 'status' állapotot" });
    }
  } else {
    res.status(405).json({ message: "A HTTP metódus nem engedélyezett" });
  }
}
