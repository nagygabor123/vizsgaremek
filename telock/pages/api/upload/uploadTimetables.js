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
    const admins = await sql('SELECT admin_id, full_name FROM admins');
    if (!Array.isArray(admins)) {
      throw new Error('Invalid response from database for admins');
    }
    const adminMap = new Map(admins.map(admin => [admin.full_name.trim(), admin.admin_id]));
    const groups = await sql('SELECT group_id, group_name FROM csoportok');
    if (!Array.isArray(groups)) {
      throw new Error('Invalid response from database for groups');
    }
    const groupMap = new Map(groups.map(group => [group.group_name.trim(), group.group_id]));
    const timetableInsertValues = [];
    const groupRelationsInsertValues = [];

    for (const entry of schedule) {
      const teacherId = adminMap.get(entry.teacher.trim());
      if (!teacherId) {
        console.warn(`Tanár nem található: ${entry.teacher}`);
        continue;
      }

      const groupNames = entry.group.split(',').map(name => name.trim());
      const groupIds = groupNames.map(name => groupMap.get(name)).filter(id => id !== undefined);

      if (groupIds.length === 0) {
        console.warn(`Csoport nem található: ${entry.group}`);
        continue;
      }

      timetableInsertValues.push([
        teacherId,
        entry.group_name, 
        dayMapping[entry.day] || 'monday',
        entry.start_time,
        entry.end_time,
      ]);

      groupRelationsInsertValues.push({ groupIds });
    }

    let timetableIds = [];

    if (timetableInsertValues.length > 0) {
      const timetablePlaceholders = timetableInsertValues
        .map((_, rowIndex) => `($${rowIndex * 5 + 1}, $${rowIndex * 5 + 2}, $${rowIndex * 5 + 3}, $${rowIndex * 5 + 4}, $${rowIndex * 5 + 5})`)
        .join(', ');

      const timetableQuery = `
        INSERT INTO timetables 
          (admin_id, group_name, day_of_week, start_time, end_time) 
        VALUES ${timetablePlaceholders}
        RETURNING timetable_id
      `;

      const timetableParams = timetableInsertValues.flat();
      const timetableResult = await sql(timetableQuery, timetableParams);
      timetableIds = timetableResult.map(row => row.timetable_id); 
    }

    if (timetableIds.length !== groupRelationsInsertValues.length) {
      console.error("HIBA: A timetable beszúrások száma nem egyezik a csoportkapcsolatok számával!");
    }

    const finalGroupRelationsInsertValues = [];

    for (let i = 0; i < timetableIds.length; i++) {
      const timetableId = timetableIds[i];
      const { groupIds } = groupRelationsInsertValues[i];

      for (const groupId of groupIds) {
        finalGroupRelationsInsertValues.push([timetableId, groupId]);
      }
    }

    if (finalGroupRelationsInsertValues.length > 0) {
      const groupRelationsPlaceholders = finalGroupRelationsInsertValues
        .map((_, rowIndex) => `($${rowIndex * 2 + 1}, $${rowIndex * 2 + 2})`)
        .join(', ');

      const groupRelationsQuery = `
        INSERT INTO group_relations 
          (timetable_id, group_id) 
        VALUES ${groupRelationsPlaceholders}
      `;

      const groupRelationsParams = finalGroupRelationsInsertValues.flat();
      await sql(groupRelationsQuery, groupRelationsParams);
    }

    res.status(201).json({ message: 'Órarend sikeresen feltöltve' });

  } catch (error) {
    console.error('Hiba az órarend feltöltésekor:', error);
    res.status(500).json({ message: 'Hiba az órarend feltöltésekor', error: error.message });
  }
}
