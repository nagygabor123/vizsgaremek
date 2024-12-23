// pages/api/locker/setLockerStatus.js
import { connectToDatabase } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    // Locker azonosító kinyerése az URL-ből
    const { id } = req.query;

    // Azonosító validálása (ellenőrizzük, hogy szám-e és 1-99 között van-e)
    const lockerId = parseInt(id);
    if (isNaN(lockerId) || lockerId < 1 || lockerId > 99) {
      return res.status(400).json({ message: 'Invalid locker number' });
    }

    try {
      // Adatbázishoz való csatlakozás
      const pool = await connectToDatabase();

      // Jelenlegi státusz lekérdezése
      const result = await pool.query(
        'SELECT status FROM lockers WHERE locker_id = $1',
        [lockerId]
      );

      // Ha nincs találat, akkor a szekrény nem létezik
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Locker not found' });
      }

      // A jelenlegi státusz lekérése
      const currentStatus = result.rows[0].status;
      const newStatus = currentStatus === 'be' ? 'ki' : 'be';

      // A szekrény státuszának frissítése
      const updateResult = await pool.query(
        'UPDATE lockers SET status = $1 WHERE locker_id = $2',
        [newStatus, lockerId]
      );

      // Ha nem történt frissítés, hiba történt
      if (updateResult.rowCount === 0) {
        return res.status(500).json({ message: 'Failed to update locker status' });
      }

      // Sikeres válasz visszaküldése
      res.status(200).json({ message: `Locker ${lockerId} status updated to '${newStatus}'` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
