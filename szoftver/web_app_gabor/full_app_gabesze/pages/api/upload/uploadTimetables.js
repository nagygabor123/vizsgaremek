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
        const teacherNames = entry.teacher.split(',').map(name => name.trim());
        const adminIds = teacherNames
          .map(teacher => adminMap.get(teacher))
          .filter(id => id !== undefined);
  
        // Csoportok feldolgozása (vesszővel elválasztva)
        const groupNames = entry.group.split(',').map(name => name.trim());
        const groupIds = groupNames
          .map(groupName => {
            // Ellenőrizzük, hogy a csoportnév létezik-e a groupMap-ben
            const groupId = groupMap.get(groupName);
            if (!groupId) {
              console.warn(`Csoport nem található: ${groupName}`);
            }
            return groupId;
          })
          .filter(id => id !== undefined); // Csak a létező group_id-ket tartjuk meg
  
        // Hibakezelés: ha nincs érvényes tanár vagy csoport ID, kihagyjuk az adatot
        if (adminIds.length === 0 || groupIds.length === 0) {
          console.warn(`Hibás adat kihagyva - Tanár: ${entry.teacher}, Csoport(ok): ${entry.group}`);
          return null;
        }
  
        // Ha több csoport is van, vesszővel elválasztva összefűzzük a group_id-ket
        const concatenatedGroupIds = groupIds.join(',');
  
        return [
          concatenatedGroupIds,  // Csoport ID-k összefűzve
          adminIds.join(','),    // Tanár ID-k összefűzve
          entry.group_name,
          dayMapping[entry.day] || 'monday', // Nap leképezése (pl. "Hétfő" -> "monday")
          entry.start_time,
          entry.end_time
        ];
      })
      .filter(entry => entry !== null); // Kihagyott elemek eltávolítása
  
    // Ha nincs érvényes adat, hibát dobunk
    if (insertValues.length === 0) {
      return res.status(400).json({ message: 'Nincs érvényes órarendi bejegyzés beszúrásra' });
    }
  
    // Beszúrás az adatbázisba
    await db.query(
      'INSERT INTO timetables (group_id, admin_id, group_name, day_of_week, start_time, end_time) VALUES ?;',
      [insertValues]
    ).catch(error => {
      console.error("Adatbázis beszúrási hiba:", error);
      throw new Error("Adatbázis hiba: " + error.message);
    });
  
    res.status(201).json({ message: 'Órarend sikeresen feltöltve' });
  } catch (error) {
    console.error('Hiba az órarend feltöltésekor:', error);
    res.status(500).json({ message: 'Hiba az órarend feltöltésekor', error: error.message });
  } finally {
    await db.end();
  }
  
}
