/**
 * @swagger
 * /api/system/control:
 *   post:
 *     summary: Automatizált diák hozzáférés vezérlés az órarend alapján
 *     description: Az API végpont lekéri az összes diákot, majd a napi órarend alapján automatikusan frissíti a hozzáférésüket.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: A rendszer elindult és folyamatosan figyeli az időt a hozzáférések frissítéséhez.
 *       500:
 *         description: Hiba történt a folyamat elindítása során.
 */

import { connectToDatabase } from '../../../lib/db';

async function fetchStudents() {
  const response = await fetch('http://localhost:3000/api/students/read');
  if (!response.ok) throw new Error('Failed to fetch students');
  return await response.json();
}

async function fetchStudentSchedule(student) {
    const response = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${student.student_id}`);
    if (response.status === 404) {
      console.error(`No schedule found for student ${student.student_id}`);
      return null; // Visszatérünk null értékkel, ha nincs órarend
    }
    if (!response.ok) throw new Error(`Failed to fetch schedule for student ${student.student_id}`);
    return await response.json();
  }

async function updateStudentAccess(student, action) {
  await fetch(`http://localhost:3000/api/system/studentCloseOpen?student=${student.student_id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
}

async function monitorStudents() {
  const students = await fetchStudents();
  const schedules = {};

  for (const student of students) {
    try {
      schedules[student.student_id] = await fetchStudentSchedule(student);
    } catch (error) {
      console.error(`Error fetching schedule for student ${student.student_id}:`, error);
    }
  }

  setInterval(async () => {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes()}`;

    for (const student of students) {
      const { start_time, end_time } = schedules[student.student_id] || {};
      if (currentTime === start_time) {
        await updateStudentAccess(student, 'close');
      }
      if (currentTime === end_time) {
        await updateStudentAccess(student, 'open');
      }
    }
  }, 60000); // Ellenőrzés percenként
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await monitorStudents();
    return res.status(200).json({ message: "System control started." });
  } catch (error) {
    console.error("Error starting system control:", error);
    return res.status(500).json({ message: "Failed to start system control" });
  }
}
