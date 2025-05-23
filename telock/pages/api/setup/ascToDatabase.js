import fs from 'fs';
import multiparty from 'multiparty';
import { parseStringPromise } from 'xml2js';
import { neon } from '@neondatabase/serverless';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'A metódus nem követhető' });
  }
  const { school_id } = req.query;
  console.log(school_id);
  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Hiba az XML fájl feldolgozása közben:', err);
      return res.status(400).json({ error: 'Hiba a fájl feltöltésekor!' });
    }

    if (!files || !files.file || files.file.length === 0) {
      return res.status(400).json({ error: 'Nincs fájl feltöltve!' });
    }

    const file = files.file[0];
    const filePath = file.path;

    try {
      const sql = neon(`${process.env.DATABASE_URL}`);
      const xmlData = fs.readFileSync(filePath, 'utf8');
      const parsedXml = await parseStringPromise(xmlData);
      console.log('Feldolgozott XML adatok:', parsedXml);

      const ringing = extractRingingSchedule(parsedXml);
      const employees = extractTeachers(parsedXml);
      const schedule = extractSchedule(parsedXml);
      const groups = extractGroups(parsedXml);

      console.log('Kinyert órarendi adatok:', schedule);
      console.log('Kinyert tanárok:', employees);
      console.log('Kinyert csoportok:', groups);

      await Promise.all([
        sendRingingData(ringing, school_id),
        sendEmployeesData(employees, school_id),
        sendGroupsData(groups, school_id),
      ]);

      await waitForDatabaseToBeReady(sql, employees.length, school_id);
      await sendScheduleData(schedule, school_id);


      return res.status(201).json({
        message: 'XML adatok sikeresen feldolgozva és továbbítva!',
        ringing,
        employees,
      });
    } catch (error) {
      console.error('Hiba az XML fájl feldolgozása közben:', error);
      return res.status(500).json({
        error: 'Hiba a fájl feldolgozása közben',
        details: error.message
      });
    }
  });
}


async function waitForDatabaseToBeReady(sql, minRows, school_id, timeout = 5000) {
  const startTime = Date.now();
  const numericSchoolId = parseInt(school_id, 10);

  if (isNaN(numericSchoolId)) {
    throw new Error('Invalid school_id');
  }

  while (Date.now() - startTime < timeout) {
    try {
      const result = await sql`SELECT COUNT(*) as count FROM admins WHERE school_id = ${numericSchoolId}`;
      const count = parseInt(result[0].count, 10);

      if (count >= minRows) {
        console.log(`Adatbázis készen áll: admins tábla (${count} sor)`);
        return;
      }

      console.log(`Várakozás az adatbázisra: admins tábla (${count} sor)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Hiba az adatbázis ellenőrzése közben:', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error(`Timeout: Az adatbázis nem állt készen ${timeout / 1000} másodperc alatt.`);
}

function extractRingingSchedule(parsedXml) {
  if (!parsedXml.timetable || !parsedXml.timetable.periods || !parsedXml.timetable.periods[0].period) {
    return [];
  }

  return parsedXml.timetable.periods[0].period.map(p => ({
    start_time: p.$.starttime,
    end_time: p.$.endtime,
  }));
}

function extractTeachers(parsedXml) {
  if (!parsedXml.timetable || !parsedXml.timetable.teachers || !parsedXml.timetable.teachers[0].teacher) {
    return [];
  }

  const teachers = parsedXml.timetable.teachers[0].teacher;
  const classes = parsedXml.timetable.classes ? parsedXml.timetable.classes[0].class : [];
  const lessons = parsedXml.timetable.lessons ? parsedXml.timetable.lessons[0].lesson : [];
  const classTeacherMap = {};

  lessons.forEach(lesson => {
    if (lesson.$.subjectid === "DAA739606BB71EE6" && lesson.$.teacherids && lesson.$.classids) {
      classTeacherMap[lesson.$.teacherids] = lesson.$.classids;
    }
  });

  return teachers.map(t => ({
    full_name: t.$.name,
    short_name: t.$.short,
    position: "Tanár",
    osztalyfonok: classTeacherMap[t.$.id] ? classes.find(c => c.$.id === classTeacherMap[t.$.id])?.$.name || null : null,
  }));
}

function extractGroups(parsedXml) {
  if (!parsedXml.timetable ||
    !parsedXml.timetable.classes ||
    !parsedXml.timetable.classes[0].class ||
    !parsedXml.timetable.groups ||
    !parsedXml.timetable.groups[0].group) {
    return [];
  }

  const classes = parsedXml.timetable.classes[0].class;
  const csoportok = parsedXml.timetable.groups[0].group;

  return [
    ...classes.map(c => ({
      name: c.$.name,
    })),
    ...csoportok
      .filter(g => g.$.name !== "Egész osztály")
      .map(g => ({
        name: g.$.name,
      }))
  ];
}

function extractSchedule(parsedXml) {
  if (!parsedXml.timetable?.lessons?.[0]?.lesson || !parsedXml.timetable?.cards?.[0]?.card) return [];

  // 1. Időszakok feldolgozása (óra kezdési és befejezési időpontjai)
  const periods = Object.fromEntries(
    parsedXml.timetable.periods[0].period.map(p => [
      p.$.period.trim(),
      { start: p.$.starttime, end: p.$.endtime }
    ])
  );

  // 2. Napok dekódolása 
  const dayCodes = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek"];
  const daysMap = Object.fromEntries(
    parsedXml.timetable.daysdefs[0].daysdef.map(d => {
      const daysBinary = d.$.days.padStart(5, '0');
      const activeDays = daysBinary
        .split("")
        .map((bit, index) => (bit === "1" ? dayCodes[index] : null))
        .filter(Boolean);

      return [d.$.id.trim(), activeDays];
    })
  );

  // 3. Tantárgyak és tanárok lekérése
  const subjects = Object.fromEntries(
    parsedXml.timetable.subjects[0].subject.map(s => [s.$.id.trim(), s.$.name])
  );

  const teachers = Object.fromEntries(
    parsedXml.timetable.teachers[0].teacher.map(t => [t.$.id.trim(), t.$.name])
  );

  // 4. Osztályok betöltése
  const classes = Object.fromEntries(
    parsedXml.timetable.classes[0].class.map(cls => [cls.$.id.trim(), cls.$.name])
  );

  // 5. Csoportok (`groups`) betöltése és kapcsolás osztályokhoz
  const groups = Object.fromEntries(
    parsedXml.timetable.groups[0].group.map(g => [
      g.$.id.trim(),
      g.$.entireclass === "1" ? classes[g.$.classid.trim()] || "Ismeretlen osztály" : g.$.name
    ])
  );

  // 6. Az órák (`lessons`) lekérése `lessonid` alapján
  const lessons = Object.fromEntries(
    parsedXml.timetable.lessons[0].lesson.map(lesson => [lesson.$.id.trim(), lesson.$])
  );

  // 7. Órarend feldolgozása a `cards` szekció alapján
  return parsedXml.timetable.cards[0].card.flatMap(card => {
    const lesson = lessons[card.$.lessonid.trim()];
    if (!lesson) return [];

    // Period hozzárendelése
    const period = periods[card.$.period?.trim()] || { start: "N/A", end: "N/A" };

    // Napok dekódolása a `days` mezőből
    const daysBinary = card.$.days.padStart(5, '0');
    const activeDays = daysBinary
      .split("")
      .map((bit, index) => (bit === "1" ? dayCodes[index] : null))
      .filter(Boolean);

    // Tanárok keresése
    const teacherIds = lesson.teacherids || "";
    const teacherNames = teacherIds.split(",")
      .map(id => teachers[id.trim()] || "Ismeretlen tanár")
      .join(", ");

    // Tantárgy keresése
    const subjectName = subjects[lesson.subjectid?.trim()] || "Ismeretlen tantárgy";

    // Csoport nevének megkeresése (`groups` táblából)
    const groupIds = lesson.groupids?.split(",")
      .map(id => groups[id.trim()] || id.trim())
      .join(",") || "Nincs csoport";

    return activeDays.map(day => ({
      day,
      start_time: period.start,
      end_time: period.end,
      group_name: subjectName,
      teacher: teacherNames,
      group: groupIds
    }));
  });
}

async function sendRingingData(ringing, school_id) {
  try {
    const response = await fetch(`https://telock.vercel.app/api/upload/uploadRinging?school_id=${school_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ringing }),
    });

    if (!response.ok) {
      throw new Error(`Hiba a ringing adatok továbbításakor: ${response.statusText}`);
    }

    console.log('Ringing adatok sikeresen továbbítva!');
  } catch (error) {
    console.error('Hiba a ringing adatok küldése közben:', error);
  }
}

async function sendEmployeesData(employees, school_id) {
  try {
    const response = await fetch(`https://telock.vercel.app/api/upload/uploadEmployees?school_id=${school_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ employees }),
    });

    if (!response.ok) {
      throw new Error(`Hiba az employees adatok továbbításakor: ${response.statusText}`);
    }

    console.log('Employees adatok sikeresen továbbítva!');
  } catch (error) {
    console.error('Hiba az employees adatok küldése közben:', error);
  }
}

async function sendGroupsData(groups, school_id) {
  try {
    const response = await fetch(`https://telock.vercel.app/api/upload/uploadGroups?school_id=${school_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groups }),
    });

    if (!response.ok) {
      throw new Error(`Hiba az groups adatok továbbításakor: ${response.statusText}`);
    }

    console.log('groups adatok sikeresen továbbítva!');
  } catch (error) {
    console.error('Hiba az groups adatok küldése közben:', error);
  }
}

async function sendScheduleData(schedule, school_id) {
  try {
    const response = await fetch(`https://telock.vercel.app/api/upload/uploadTimetables?school_id=${school_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ schedule }),
    });

    if (!response.ok) {
      throw new Error(`Error sending schedule data: ${response.statusText}`);
    }

    console.log('Schedule data successfully sent!');
  } catch (error) {
    console.error('Error sending schedule data:', error);
  }
}