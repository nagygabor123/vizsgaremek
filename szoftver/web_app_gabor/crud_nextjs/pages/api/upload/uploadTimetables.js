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
  if (req.method === 'POST') {
    const { schedule } = req.body;
    
    if (!Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty schedule array' });
    }

    const db = await connectToDatabase();

    try {
      // Lekérdezzük az admin_id értékeket
      const [admins] = await db.query('SELECT admin_id, full_name FROM admins');
      const adminMap = new Map(admins.map(admin => [admin.full_name, admin.admin_id]));
      
      const insertValues = schedule.map(entry => {
        const adminId = adminMap.get(entry.teacher);
        if (!adminId) {
          throw new Error(`No matching admin found for teacher: ${entry.teacher}`);
        }

        return [
          entry.group,
          adminId,
          dayMapping[entry.day] || 'monday', // Alapértelmezett érték monday, ha nincs megfelelő
          entry.start_time,
          entry.end_time
        ];
      });

      await db.query(
        'INSERT INTO timetables (`group`, admin_id, day_of_week, start_time, end_time) VALUES ?;',
        [insertValues]
      );

      res.status(201).json({ message: 'Timetables uploaded successfully' });
    } catch (error) {
      console.error('Error uploading timetables:', error);
      res.status(500).json({ message: 'Error uploading timetables', error: error.message });
    } finally {
      await db.end();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
