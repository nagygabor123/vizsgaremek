/**
 * @swagger
 * /api/config/getRinging:
 *   get:
 *     summary: Csengetési rend lekérdezése
 *     description: Lekéri a csengetési idők listáját az `ring_times` táblából.
 *     tags:
 *       - Configuration
 *     responses:
 *       200:
 *         description: Sikeres lekérdezés, a csengetési idők visszaadása.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     description: A csengetési idő kezdete (HH:MM formátumban).
 *                     example: "07:15"
 *                   end:
 *                     type: string
 *                     description: A csengetési idő vége (HH:MM formátumban).
 *                     example: "08:00"
 *       500:
 *         description: Hiba történt az adatbázis lekérdezése során.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Hiba a csengetési rend lekérdezésekor"
 *       405:
 *         description: Hibás HTTP metódus (csak GET engedélyezett).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Csak a GET metódus használható"
 */
// import { connectToDatabase } from '../../../lib/db';

// export default async function handler(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Csak a GET metódus használható' });
//   }

//   let db;
//   try {
//     db = await connectToDatabase();
//     const [rows] = await db.execute('SELECT start_time as "start", end_time as "end" FROM ring_times');

//     const result = rows.map(row => ({
//       start: row.start.slice(0, 5),  
//       end: row.end.slice(0, 5)        
//     }));

//     return res.status(200).json(result);
//   } catch (error) {
//     console.error('Hiba a csengetési rend lekérdezésekor:', error);
//     return res.status(500).json({ error: 'Hiba a csengetési rend lekérdezésekor' });
//   } finally {
//     if (db) {
//       await db.end();
//     }
//   }
// }
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Csak a GET metódus használható' });
  }

  try {
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Execute the query
    const rows = await sql('SELECT start_time as "start", end_time as "end" FROM ring_times');

    // Format the result
    const result = rows.map(row => ({
      start: row.start.slice(0, 5),  
      end: row.end.slice(0, 5)        
    }));

    return res.status(200).json(result);
  } catch (error) {
    console.error('Hiba a csengetési rend lekérdezésekor:', error);
    return res.status(500).json({ error: 'Hiba a csengetési rend lekérdezésekor' });
  }
}