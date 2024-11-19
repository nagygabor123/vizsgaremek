import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action } = req.body;  // A request body-ban jön a "close" vagy "open" üzenet

    // Ellenőrizzük, hogy a kapott action érték érvényes-e
    if (action !== 'close' && action !== 'open') {
      return res.status(400).json({ message: "Invalid action" });
    }

    const db = await connectToDatabase();
    // Az access mezőt frissítjük mindenkinek a students táblában
    const newAccessState = action === 'close' ? 'zarva' : 'nyitva';

    try {
      // Az 'acces' oszlopot frissítjük
      await db.query('UPDATE students SET access = ?', [newAccessState]);

      return res.status(200).json({ message: `All students' access updated to ${newAccessState}` });
    } catch (error) {
      console.error("Error updating access state:", error);
      return res.status(500).json({ message: "Failed to update access state" });
    }
  } else {
    // Ha nem POST metódust használunk, akkor 405-ös hibát küldünk
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
