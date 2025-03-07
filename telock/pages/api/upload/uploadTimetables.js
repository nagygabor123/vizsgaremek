import { neon } from '@neondatabase/serverless';

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

  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    // Lekérdezzük az adminokat és a csoportokat
    const admins = await sql('SELECT admin_id, full_name FROM admins');
    const adminMap = new Map(admins.map(admin => [admin.full_name, admin.admin_id]));

    const groups = await sql('SELECT group_id, group_name FROM csoportok');
    const groupMap = new Map(groups.map(group => [group.group_name, group.group_id]));

    const groupRelationsInsertValues = [];

    for (const entry of schedule) {
      // Tanár ID lekérése
      const teacherId = adminMap.get(entry.teacher.trim());
      if (!teacherId) {
        console.warn(`Tanár nem található: ${entry.teacher}`);
        continue;
      }

      // Csoport ID-k lekérése
      const groupNames = entry.group.split(',').map(name => name.trim());
      const groupIds = groupNames.map(name => groupMap.get(name)).filter(id => id !== undefined);

      if (groupIds.length === 0) {
        console.warn(`Csoport nem található: ${entry.group}`);
        continue;
      }

      // Órarendi bejegyzés beszúrása
      const timetableResult = await sql(
        'INSERT INTO timetables (admin_id, group_name, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING timetable_id',
        [teacherId, entry.group_name, dayMapping[entry.day] || 'monday', entry.start_time, entry.end_time]
      );

      const timetableId = timetableResult[0].timetable_id;

      // Kapcsolatok beszúrása a group_relations táblába
      for (const groupId of groupIds) {
        groupRelationsInsertValues.push([timetableId, groupId]);
      }
    }

    // Ha vannak kapcsolatok, azokat beszúrjuk
    if (groupRelationsInsertValues.length > 0) {
      await sql(
        'INSERT INTO group_relations (timetable_id, group_id) VALUES ' + 
        groupRelationsInsertValues.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', '),
        groupRelationsInsertValues.flat()
      );
    }

    res.status(201).json({ message: 'Órarend sikeresen feltöltve' });

  } catch (error) {
    console.error('Hiba az órarend feltöltésekor:', error);
    res.status(500).json({ message: 'Hiba az órarend feltöltésekor', error: error.message });
  }
}