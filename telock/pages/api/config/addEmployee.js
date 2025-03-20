
/**
 * @swagger
 * /api/config/addEmployees:
 *   post:
 *     summary: Új admin hozzáadása
 *     description: Hozzáad egy új adminisztrátort az adatbázishoz, automatikusan generált jelszóval.
 *     tags:
 *       - Configuration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - position
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Kiss Péter"
 *                 description: Az adminisztrátor teljes neve.
 *               position:
 *                 type: string
 *                 example: "Rendszergazda"
 *                 description: Az adminisztrátor munkaköre.
 *     responses:
 *       201:
 *         description: Az adminisztrátor sikeresen létrehozva.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin created"
 *                 password:
 *                   type: string
 *                   example: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
 *                   description: A generált jelszó.
 *       400:
 *         description: Hiányzó kötelező mezők.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Adatbázis hiba az admin létrehozása közben.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating admin"
 *       405:
 *         description: Hibás HTTP metódus (csak POST engedélyezett).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Method Not Allowed"
 */

import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString('hex');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { full_name, position,osztalyfonok,short_name } = req.body;

    if (!full_name || !position ||!osztalyfonok||!short_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const password = generatePassword(); 
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      const lastAdmin = await sql('SELECT MAX(admin_id) AS max_id FROM admins');
      let nextAdminId = 3;
      if (lastAdmin.length > 0) {
        nextAdminId = lastAdmin[0].admin_id + 1; 
      }

      await sql(
        'INSERT INTO admins (admin_id, full_name, password, position,osztalyfonok,short_name) VALUES ($1, $2, $3, $4, $5,$6)',
        [nextAdminId, full_name, password, position,osztalyfonok,short_name]
      );
      
      res.status(201).json({ message: 'Admin created', password }); 
    } catch (error) {
      console.error('Error creating admin:', error);  
      res.status(500).json({ message: 'Error creating admin', error: error.message });
    } 
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
