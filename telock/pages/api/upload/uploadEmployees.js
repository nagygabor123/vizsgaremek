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

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      // Lekérdezzük az utolsó admin_id-t
      const lastAdmin = await sql('SELECT admin_id FROM admins ORDER BY admin_id DESC LIMIT 1');
      
      let nextAdminId = 3;
      if (lastAdmin.length > 0) {
        nextAdminId = lastAdmin[0].admin_id + 1;
      }

      // Beszúrási értékek előkészítése
      for (const employee of employees) {
        await sql(
          'INSERT INTO admins (admin_id, full_name, password, position, osztalyfonok, short_name) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            nextAdminId++, 
            employee.full_name, 
            generatePassword(), 
            employee.position, 
            employee.osztalyfonok || 'nincs', // Ha null, akkor "nincs"
            employee.short_name || null // Adding short_name to the insert values
          ]
        );
      }

      res.status(201).json({ message: 'Admins uploaded successfully' });
    } catch (error) {
      console.error('Error uploading admins:', error);
      res.status(500).json({ message: 'Error uploading admins', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}