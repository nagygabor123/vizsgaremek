import { connectToDatabase } from '../../../lib/db';

const dayMapping = {
  'Hétfő': 'monday',
  'Kedd': 'tuesday',
  'Szerda': 'wednesday',
  'Csütörtök': 'thursday',
  'Péntek': 'friday',
  'Szombat': 'saturday',
  'Vasárnap': 'sunday'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { schedule } = req.body;

  if (!Array.isArray(schedule) || schedule.length === 0) {
    return res.status(400).json({ message: 'Invalid or empty schedule array' });
  }

  const db = await connectToDatabase();

  try {
    // Lekérdezzük az admin_id értékeket
    const [admins] = await db.query('SELECT admin_id, full_name FROM admins');
    const adminMap = new Map(admins.map(admin => [admin.full_name, admin.admin_id]));

    const insertValues = schedule
      .map(entry => {
        const adminId = adminMap.get(entry.teacher) || null; // Ha nincs megfelelő admin_id, legyen null

        return [
          entry.group,
          adminId, // Most már null lehet, ha nincs megfelelő tanár
          dayMapping[entry.day] || 'monday',
          entry.group_name,
          entry.start_time,
          entry.end_time
        ];
      })
      .filter(entry => entry[1] !== null); // Eltávolítja azokat az adatokat, ahol nincs admin_id

    if (insertValues.length === 0) {
      return res.status(400).json({ message: 'No valid timetable entries to insert' });
    }

    await db.query(
      'INSERT INTO timetables (`group`, admin_id, day_of_week,group_name, start_time, end_time) VALUES ?;',
      [insertValues]
    ).catch(error => {
      console.error("Database insert error:", error);
      throw new Error("Database error: " + error.message);
    });

    res.status(201).json({ message: 'Timetables uploaded successfully' });
  } catch (error) {
    console.error('Error uploading timetables:', error);
    res.status(500).json({ message: 'Error uploading timetables', error: error.message });
  }
}
