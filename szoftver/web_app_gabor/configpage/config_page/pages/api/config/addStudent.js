import pool from '../../../lib/db';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed' });
  }

  try {
    // Az 'uploads/students.csv' fájl elérési útja
    const filePath = path.join(process.cwd(), 'uploads', 'students.csv');

    // Ellenőrizzük, hogy a fájl létezik-e
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'students.csv file not found in uploads folder' });
    }

    // A fájl olvasása
    const csvData = fs.readFileSync(filePath, 'utf8');
    const rows = csvData.split('\n').filter(Boolean);
    const header = rows.shift().split(',');

    const data = rows.map((row) => {
      const values = row.split(',');
      return header.reduce((acc, key, index) => {
        acc[key] = values[index];
        return acc;
      }, {});
    });

    // SQL lekérdezés a diákok hozzáadásához
    const insertQuery = 'INSERT INTO students (`student_id`, `full_name`, `class`, `rfid_tag`, `access`) VALUES (?, ?, ?, ?, ?)';
    for (let student of data) {
      const { student_id, full_name, class: studentClass, rfid_tag, access } = student;

      if (!student_id || !full_name || !studentClass || !rfid_tag) {
        return res.status(400).json({ message: 'Missing required fields for a student' });
      }

      // PostgreSQL lekérdezés
      await pool.query(insertQuery, [student_id, full_name, studentClass, rfid_tag, access]);
    }

    return res.status(200).json({ message: 'Students added successfully' });
  } catch (error) {
    console.error('Error processing the file:', error);
    return res.status(500).json({ error: 'Failed to process the file' });
  }
}
