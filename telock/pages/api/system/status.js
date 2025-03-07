/**
 * @swagger
 * /api/system/status:
 *   get:
 *     summary: Rendszer státusz lekérése
 *     description: Lekérdezi a rendszer státuszát az adatbázisból az id = 1 alapján.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: A rendszer aktuális státusza
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Aktív"
 *       404:
 *         description: A rendszer státusza nem található
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "System status not found"
 *       500:
 *         description: Hiba történt az adatbázis kapcsolat során
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 *       405:
 *         description: Az adott HTTP metódus nem engedélyezett
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Method Not Allowed"
 */
// import { connectToDatabase } from '../../../lib/db';

// export default async function handler(req, res) {
//   if (req.method === 'GET') {
//     let connection;
//     try {
//       connection = await connectToDatabase();
//       const [rows] = await connection.execute('SELECT status FROM system_status WHERE id = 1');

//       if (rows.length === 0) {
//         return res.status(404).json({ error: 'System status not found' });
//       }

//       return res.status(200).json({ status: rows[0].status });
//     } catch (error) {
//       console.error('Database error:', error);
//       return res.status(500).json({ error: 'Database connection error' });
//     } finally {
//       if (connection) {
//         await connection.end();
//       }
//     }
//   } else {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Connect to the Neon database
      const sql = neon(process.env.DATABASE_URL);

      // Query the system status
      const result = await sql('SELECT status FROM system_status WHERE id = 1');

      if (result.length === 0) {
        return res.status(404).json({ error: 'System status not found' });
      }

      return res.status(200).json({ status: result[0].status });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database connection error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}