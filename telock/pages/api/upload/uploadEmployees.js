import { neon } from '@neondatabase/serverless';
import { hash } from 'bcrypt';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { school_id } = req.query;
    console.log(school_id);
    const { employees } = req.body;
    console.log(employees);
    const numericSchoolId = parseInt(school_id, 10);
    if (isNaN(numericSchoolId)) {
      return res.status(400).json({ message: 'Érvénytelen iskola azonosító' });
    }

    if (!school_id || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ message: 'Az employees tömb üres vagy hibás' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
      const lastAdmin = await sql`SELECT admin_id FROM admins WHERE school_id = ${school_id} ORDER BY admin_id DESC LIMIT 1`;
      
      let nextAdminId = 1;
      if (lastAdmin.length > 0) {
        nextAdminId = lastAdmin[0].admin_id + 1;
      }

      const insertValues = await Promise.all(employees.map(async (employee) => {
        const password = employee.short_name + "123";
        const hashedPassword = await hash(password, 10);
      
        return [
          nextAdminId++,
          employee.full_name,
          hashedPassword,
          employee.position,
          employee.osztalyfonok || 'nincs',
          employee.short_name || null,
          school_id  
        ];
      }));

      const query = `
        INSERT INTO admins 
          (admin_id, full_name, password, position, osztalyfonok, short_name, school_id)
        VALUES ${insertValues.map((_, i) => 
          `($${i*7+1}, $${i*7+2}, $${i*7+3}, $${i*7+4}, $${i*7+5}, $${i*7+6}, $${i*7+7})`
        ).join(', ')}
      `;

      const params = insertValues.flat();

      await sql(query, params);

      res.status(201).json({ message: 'Tanárok sikeresen feltöltve' });
    } catch (error) {
      console.error('Hiba az adatok feltöltésekor:', error);
      res.status(500).json({ 
        message: 'Hiba az adatok feltöltésekor', 
        error: error.message 
      });
    }
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}