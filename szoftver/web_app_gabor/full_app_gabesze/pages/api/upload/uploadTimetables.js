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
    const [admins] = await db.query('SELECT admin_id, full_name FROM admins');
    const adminMap = new Map(admins.map(admin => [admin.full_name, admin.admin_id]));
  
    const [groups] = await db.query('SELECT group_id, group_name FROM groups');
    const groupMap = new Map(groups.map(group => [group.group_name, group.group_id]));
  
    const insertValues = schedule
      .map(entry => {
        // Több tanár kezelése: vesszővel elválasztott nevek
        const teacherNames = entry.teacher.split(',').map(name => name.trim()); // Tanárok név listája
        const adminIds = teacherNames
          .map(teacher => adminMap.get(teacher)) // Keresés minden egyes tanár ID-ja alapján
          .filter(id => id !== undefined); // Csak a létező admin_id-ket tartjuk meg
  
        // Csoportok feldolgozása (vesszővel elválasztva)
        const groupNames = entry.group.split(',').map(name => name.trim()); // Szétválasztás és felesleges szóközök eltávolítása
        const groupIds = groupNames
          .map(groupName => groupMap.get(groupName))
          .filter(id => id !== undefined); // Csak a létező group_id-ket tartjuk meg
  
        if (adminIds.length === 0 || groupIds.length === 0) {
          console.warn(`Hibás adat kihagyva - Tanár: ${entry.teacher}, Csoport(ok): ${entry.group}`);
          return null;
        }
  
        // Ha több csoport is egy órát tart, akkor azok group_id-jait vesszővel összefűzzük
        const groupIdsString = groupIds.join(',');
  
        return [
          groupIdsString,  // Csoport ID-k összefűzve
          adminIds.join(','),   // Tanár ID-k összefűzve
          entry.group_name,
          dayMapping[entry.day] || 'monday',
          entry.start_time,
          entry.end_time
        ];
      })
      .filter(entry => entry !== null);
  
    if (insertValues.length === 0) {
      return res.status(400).json({ message: 'No valid timetable entries to insert' });
    }
  
    await db.query(
      'INSERT INTO timetables (group_id, admin_id, group_name, day_of_week, start_time, end_time) VALUES ?;',
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
