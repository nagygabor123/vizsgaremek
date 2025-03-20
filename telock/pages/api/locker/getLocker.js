import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);


export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { rfid } = req.query;

    if (!rfid) {
      return res.status(400).json({ error: 'RFID szükséges' });
    }

    try {
      const student = await sql('SELECT student_id, access FROM students WHERE rfid_tag = $1',[rfid]);

      if (student.length === 0) {
        return res.status(200).send("nincs");
      }

      const studentid = student[0].student_id;
      const studentaccess = student[0].access;

      const scheduleResponse = await fetch(`https://vizsgaremek-mocha.vercel.app/api/timetable/scheduleStart?student=${studentid}`);
      if (!scheduleResponse.ok) {
        return res.status(500).json({ error: 'Nem sikerült lekérni a diák órarendjét.' });
      }

      const schedule = await scheduleResponse.json();
      const { first_class_start, last_class_end } = schedule;

      const currentTime = new Date().toTimeString().slice(0, 5); 
      console.log(studentid); 
      console.log(studentaccess); 
      console.log(scheduleResponse); 
      console.log(currentTime); 


      if (currentTime >= first_class_start && currentTime <= last_class_end) {
        if (studentaccess === "nyithato") {
          const lockerResult = await getLockerByRFID(rfid);

          if (lockerResult.error) {
            return res.status(lockerResult.status).json({ error: lockerResult.error });
          }

          return res.status(200).send(lockerResult.lockerId);
        } else {
          return res.status(200).send("zarva");
        }
      } else {
        const lockerResult = await getLockerByRFID(rfid);

        if (lockerResult.error) {
          return res.status(lockerResult.status).json({ error: lockerResult.error });
        }

        return res.status(200).send(lockerResult.lockerId);
      }
    } catch (error) {
      console.error('Adatbazis error:', error);
      return res.status(500).json({ error: 'Adatbázis csatlakozási hiba' });
    }
  } else {
    return res.status(405).json({ error: 'A módszer nem engedélyezett' });
  }
}

async function getLockerByRFID(rfid) {
  const lockerRelationship = await sql('SELECT locker_id FROM locker_relationships WHERE rfid_tag = $1',[rfid]);

  if (lockerRelationship.length === 0) {
    return { error: 'Nem található szekrény_id ehhez az RFID-hez', status: 404 };
  }

  const lockerId = lockerRelationship[0].locker_id;
  const locker = await sql('SELECT * FROM lockers WHERE locker_id = $1',[lockerId]);

  if (locker.length === 0) {
    return { error: 'Nem található a szekrény', status: 404 };
  }

  return { lockerId: locker[0].locker_id.toString(), status: 200 };
}