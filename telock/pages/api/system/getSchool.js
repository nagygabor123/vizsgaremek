// pages/api/system/getSchool.js
import { neon } from '@neondatabase/serverless';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

export default async function handler(req, res) {
  // 1. Session ellenőrzése
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Nem vagy bejelentkezve' });
  }

  // 2. Csak GET metódus engedélyezése
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `A ${req.method} metódus nem engedélyezett` });
  }

  // 3. Paraméter ellenőrzése
  const { school_id } = req.query;

  if (!school_id) {
    return res.status(400).json({ error: 'Iskola azonosító szükséges' });
  }

  // 4. Adatbázis kapcsolat és lekérdezés
  const sql = neon(process.env.DATABASE_URL);

  try {
    const rows = await sql('SELECT school_name FROM schools WHERE school_id = $1', [school_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Iskola nem található' });
    }

    // 5. Sikeres válasz
    return res.status(200).json({ 
      school_name: rows[0].school_name
    });
    
  } catch (error) {
    console.error('Adatbázis hiba:', error);
    return res.status(500).json({ 
      error: 'Hiba az adatok lekérdezésekor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}