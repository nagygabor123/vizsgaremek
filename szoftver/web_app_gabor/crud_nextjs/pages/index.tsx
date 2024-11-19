import '../styles/style.css';  // Import the style.css file
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

// Diák típus
interface Student {
  student_id: string;
  full_name: string;
  class: string;
  rfid_tag: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState<Student>({
    student_id: '',
    full_name: '',
    class: '',
    rfid_tag: '',
  });
  const [editing, setEditing] = useState<boolean>(false);
  const [editStudentId, setEditStudentId] = useState<string | null>(null);

  // State for system closure
  const [systemClose, setSystemClose] = useState<boolean>(false); // initial state is false

  // Fetch students from the database
  const fetchStudents = async () => {
    const response = await fetch('/api/students/read');
    const data = await response.json();
    setStudents(data);
  };

  // Call fetchStudents on initial load
  useEffect(() => {
    fetchStudents();
  }, []);

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
      setFormData({ student_id: '', full_name: '', class: '', rfid_tag: '' });
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
    
    // Send the action to the API
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
            {student.full_name} ({student.class})
            <button onClick={() => handleEdit(student)}>Edit</button>
            <button onClick={() => handleDelete(student.student_id)}>Delete</button>
            <button onClick={() => handleStudentOpen(student.student_id)}>Feloldás</button>
          </li>
        ))}
      </ul>

      <Button variant="outline" onClick={handleSystemClose}>
        {systemClose ? 'Feloldás' : 'Zárás'}
      </Button>
    </div>
  );
}
