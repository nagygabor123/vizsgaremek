"use client";  // Add this line at the top

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import '../../globals.css';

// Diák típus
interface Student {
  student_id: string;
  full_name: string;
  class: string;
  rfid_tag: string;
  status: string;
}

interface Timetable {
  student_id: string;
  first_class_start: string;
  last_class_end: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentTimetable, setStudentTimetable] = useState<Timetable[]>([]);
  const [formData, setFormData] = useState<Student>({
    student_id: '',
    full_name: '',
    class: '',
    rfid_tag: '',
    status: '',
  });
  const [editing, setEditing] = useState<boolean>(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);
  const [systemClose, setSystemClose] = useState<boolean>(false);

  // Fetch students from the database
  const fetchStudents = async () => {
    const response = await fetch('/api/students/read');
    const data = await response.json();
    setStudents(data);
  };

  // Fetch system status from the database
  const fetchSystemStatus = async () => {
    const response = await fetch('http://localhost:3000/api/system/status');
    if (response.ok) {
      const data = await response.json();
      setSystemClose(data.status === "nyithato" ? false : true);
    }
  };

  // Fetch timetable for each student
  const fetchStudentTimetable = async (student_id: string) => {
    const response = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${student_id}`);
    const data = await response.json();
    return data;
  };

  // Call fetchStudents and fetchSystemStatus on initial load
  useEffect(() => {
    fetchStudents();
    fetchSystemStatus();
  }, []);

  // Fetch timetable for each student
  useEffect(() => {
    const fetchTimetables = async () => {
      const timetables = await Promise.all(
        students.map(async (student) => {
          const timetable = await fetchStudentTimetable(student.student_id);
          return {
            student_id: student.student_id,
            first_class_start: timetable.first_class_start,
            last_class_end: timetable.last_class_end,
          };
        })
      );
      setStudentTimetable(timetables);
    };

    if (students.length > 0) {
      fetchTimetables();
    }
  }, [students]);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for creating or updating students
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? '/api/students/update' : '/api/students/create';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormData({ student_id: '', full_name: '', class: '', rfid_tag: '', status:'' });
      setEditing(false);
      setEditStudentId(null);
      fetchStudents();  // Refresh the student list after creating or updating
    }
  };

  // Handle deleting a student
  const handleDelete = async (student_id: string) => {
    const response = await fetch('/api/students/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id }),
    });

    if (response.ok) {
      fetchStudents();  // Refresh the student list after deletion
    }
  };

  // Handle editing a student
  const handleEdit = (student: Student) => {
    setFormData(student);
    setEditing(true);
    setEditStudentId(student.student_id);
  };

  // Handle system close/unlock button click
  const handleSystemClose = async () => {
    const action = systemClose ? 'open' : 'close'; // Determine whether to send "open" or "close"
    const response = await fetch('/api/system/closeOpen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (response.ok) {
      setSystemClose((prevState) => !prevState); // Toggle the systemClose state
    }
  };

  const handleStudentOpen = async (student_id: string) => {
    const response = await fetch('/api/locker/studentOpen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id }),
    });
  };

  return (
    <div>
      <h1>Manage Students</h1>
      <form onSubmit={handleSubmit}>
        <Input 
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={formData.student_id}
          onChange={handleChange}
        />
        <Input 
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
        />
        <Input 
          type="text"
          name="class"
          placeholder="Class"
          value={formData.class}
          onChange={handleChange}
        />
        <Input 
          type="text"
          name="rfid_tag"
          placeholder="RFID Tag"
          value={formData.rfid_tag}
          onChange={handleChange}
        />
        
        <Button variant="outline" type="submit">{editing ? 'Update' : 'Add'} Student</Button>
      </form>

      <h2>Student List</h2>
      <ul>
        {students.map((student) => (
          <li key={student.student_id}>
            {student.full_name} ({student.class}, {student.status})
            <Button onClick={() => handleEdit(student)}>Edit</Button>
            <Button onClick={() => handleDelete(student.student_id)}>Delete</Button>
            <Button onClick={() => handleStudentOpen(student.student_id)} disabled={!systemClose}>Feloldás</Button>
            <div>
              {/* Display timetable information */}
              {studentTimetable.find((timetable) => timetable.student_id === student.student_id) && (
                <p>
                  First class starts at: {studentTimetable.find((timetable) => timetable.student_id === student.student_id)?.first_class_start}<br />
                  Last class ends at: {studentTimetable.find((timetable) => timetable.student_id === student.student_id)?.last_class_end}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <Button variant="outline" onClick={handleSystemClose}>
        {systemClose ? 'Feloldás' : 'Zárás'}
      </Button>
    </div>
  );
}
