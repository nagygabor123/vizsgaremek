import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { student_id, full_name, class: studentClass, rfid_tag } = req.body;

  if (!student_id || !full_name || !studentClass || !rfid_tag) {
    return res.status(400).json({ message: 'Hiányzó vagy érvénytelen mezők' });
  }

  const sql = neon(process.env.DATABASE_URL);
  try {
    const studentData = await sql(
      'SELECT rfid_tag FROM students WHERE student_id = $1',
      [student_id]
    );

    if (studentData.length === 0) {
      return res.status(404).json({ message: 'A diák nem található' });
    }

    const currentRfidTag = studentData[0].rfid_tag;

    if (currentRfidTag === rfid_tag) {
      await sql(
        'UPDATE students SET full_name = $1, class = $2 WHERE student_id = $3',
        [full_name, studentClass, student_id]
      );
      await setStudentGroups(student_id);
      return res.status(200).json({ message: 'Sikeres frissítés' });
    }

    const duplicateRfidError = await dataCheck(sql, rfid_tag, student_id);
    if (duplicateRfidError) {
      return res.status(400).json(duplicateRfidError);
    }

    const existingLocker = await sql(
      'SELECT relationship_id FROM locker_relationships WHERE rfid_tag = $1',
      [currentRfidTag]
    );

    if (existingLocker.length > 0) {
      const latestStudent = await sql('SELECT MAX(student_id) AS max_id FROM students');
      const newStudentId = latestStudent[0].max_id + 1;

      await sql(
        'INSERT INTO students (student_id, full_name, class, rfid_tag, access) VALUES ($1, $2, $3, $4, $5)',
        [newStudentId, full_name, studentClass, rfid_tag, 'zarva']
      );

      await sql(
        'UPDATE locker_relationships SET rfid_tag = $1 WHERE relationship_id = $2',
        [rfid_tag, existingLocker[0].relationship_id]
      );

      await deleteStudent(student_id);
      await setStudentGroups(newStudentId);
      return res.status(200).json({ message: 'Sikeres diák és szekrény kapcsolat frissítés' });
    }

    return res.status(404).json({ message: 'A diák és szekrény kapcsolat nem található' });

  } catch (error) {
    console.error('Hiba a frissítés során:', error);
    res.status(500).json({ message: '	Hiba történt a diák adatainak frissítése során', error: error.message });
  }
}

async function dataCheck(sql, rfid_tag, student_id) {
  const existingRfid = await sql(
    'SELECT student_id FROM students WHERE rfid_tag = $1',
    [rfid_tag]
  );

  if (existingRfid.length > 0 && existingRfid[0].student_id !== student_id) {
    return { message: 'Ismétlődő RFID azonosító' };
  }

  return null;  
}

async function deleteStudent(student_id) {
  const deleteResponse = await fetch(`https://vizsgaremek-mocha.vercel.app/api/students/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id }),
  });
  if (!deleteResponse.ok) {
    throw new Error('Sikertelen törlés');
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
    console.error('Hiba az "api/students/setStudentGroups" végpont meghívása során:', error);
    throw error; 
  }
}