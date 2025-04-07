import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { student_id, full_name, class: studentClass, rfid_tag, school_id } = req.body;

    if (!student_id || !full_name || !studentClass || !rfid_tag || !school_id) {
      return res.status(400).json({ message: 'Hiányzó kötelező mezők' });
    }

    try {
      
      await sql(
        'INSERT INTO students (student_id, full_name, class, rfid_tag, access, school_id) VALUES ($1, $2, $3, $4, $5, $6);',
        [student_id, full_name, studentClass, rfid_tag, 'zarva', school_id]
      );


      const maxLocker = await sql('SELECT MAX(locker_id) AS max_id FROM lockers;');
      let nextLockerId = maxLocker.length > 0 && maxLocker[0].max_id ? maxLocker[0].max_id + 1 : 8;

      await sql('INSERT INTO lockers (locker_id, status) VALUES ($1, $2);', [nextLockerId, 'ki']);
      await sql('INSERT INTO locker_relationships (rfid_tag, locker_id) VALUES ($1, $2);', [rfid_tag, nextLockerId]);



      const result = await setStudentGroups(student_id);
      console.log('Tanuló csoportok: ', result);
      res.status(201).json({ message: 'Sikeresen létrehozott diák, szekrény:', locker_id: nextLockerId });
    } catch (error) {
      console.error('Adatbázis hiba:', error);
      res.status(500).json({ message: 'Hiba a diák létrehozása során', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'A HTTP metódus nem engedélyezett' });
  }
}


async function setStudentGroups(student_id) {
  const url = `https://vizsgaremek-mocha.vercel.app/api/students/setStudentGroups?student_id=${student_id}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Válasz:', data);
    return data;
  } catch (error) {
    console.error('Hiba az "api/students/setStudentGroups" végpont meghívása során', error);
    throw error;
  }
}

