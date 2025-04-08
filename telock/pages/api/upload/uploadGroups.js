import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { school_id } = req.query;
    console.log(school_id);
    const { groups } = req.body;
    console.log(groups);


    if (!school_id || !Array.isArray(groups) || groups.length === 0) {
      return res.status(400).json({ message: 'A groups tömb üres vagy hibás' });
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
      const insertPromises = groups.map(group =>
        sql('INSERT INTO csoportok (group_name,school_id) VALUES ($1,$2)', [group.name, school_id])
      );

      await Promise.all(insertPromises);

      res.status(201).json({ message: 'Csoportok sikeresen feltöltve!' });
    } catch (error) {
      console.error('Hiba az adatok feltöltésekor:', error);
      res.status(500).json({ message: 'Error uploaHiba az adatok feltöltésekording groups', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}