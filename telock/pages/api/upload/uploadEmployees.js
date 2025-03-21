import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

function generatePassword(length = 12) {
  return crypto.randomBytes(length).toString('hex');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { employees } = req.body;
    
    if (!Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty employees array' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
      const lastAdmin = await sql('SELECT admin_id FROM admins ORDER BY admin_id DESC LIMIT 1');
      
      let nextAdminId = 1;
      if (lastAdmin.length > 0) {
        nextAdminId = lastAdmin[0].admin_id + 1;
      }

      const insertValues = employees.map(employee => [
        nextAdminId++,
        employee.full_name,
        generatePassword(),
        employee.position,
        employee.osztalyfonok || 'nincs',
        employee.short_name || null
      ]);

      const placeholders = insertValues.map(
        (_, rowIndex) => `($${rowIndex * 6 + 1}, $${rowIndex * 6 + 2}, $${rowIndex * 6 + 3}, $${rowIndex * 6 + 4}, $${rowIndex * 6 + 5}, $${rowIndex * 6 + 6})`
      ).join(', ');

      const query = `
        INSERT INTO admins 
          (admin_id, full_name, password, position, osztalyfonok, short_name)
        VALUES ${placeholders}
      `;

      const params = insertValues.flat();

      await sql(query, params);

      res.status(201).json({ message: 'Admins uploaded successfully' });
    } catch (error) {
      console.error('Error uploading admins:', error);
      res.status(500).json({ message: 'Error uploading admins', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}