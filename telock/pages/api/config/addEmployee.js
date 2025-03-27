import { neon } from '@neondatabase/serverless';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }

  const { full_name, position, osztalyfonok, short_name } = req.body;
  if (!full_name || !position || !osztalyfonok || !short_name) {
    return res.status(400).json({ message: 'Hiányzó kötelező mezők' });
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    const lastAdmin = await sql`SELECT MAX(admin_id) AS max_id FROM admins`;
    let nextAdminId = lastAdmin[0]?.max_id ? lastAdmin[0].max_id + 1 : 1;

    const password = short_name + "123";
    const hashedPassword = await hash(password, 10);

    await sql`
      INSERT INTO admins (admin_id, full_name, password, position, osztalyfonok, short_name) 
      VALUES (${nextAdminId}, ${full_name}, ${hashedPassword}, ${position}, ${osztalyfonok}, ${short_name})
    `;

    res.status(201).json({ message: 'Sikeresen hozzáadott alkalmazott!' });
  } catch (error) {
    console.error('Hiba a hozzáadás során:', error);
    res.status(500).json({ message: 'Hiba a hozzáadás során', error: error.message });
  }
}
