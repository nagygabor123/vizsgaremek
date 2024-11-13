import { useState, useEffect } from 'react';

export default function Home() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    full_name: '',
    class: '',
    rfid_tag: '',
  });
  const [editing, setEditing] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for creating or updating students
  const handleSubmit = async (e) => {
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
  const handleDelete = async (student_id) => {
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
  const handleEdit = (student) => {
    setFormData(student);
    setEditing(true);
    setEditStudentId(student.student_id);
  };

  return (
    <div>
      <h1>Manage Students</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="student_id"
          placeholder="Student ID"
          value={formData.student_id}
          onChange={handleChange}
        />
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="class"
          placeholder="Class"
          value={formData.class}
          onChange={handleChange}
        />
        <input
          type="text"
          name="rfid_tag"
          placeholder="RFID Tag"
          value={formData.rfid_tag}
          onChange={handleChange}
        />
        <button type="submit">{editing ? 'Update' : 'Add'} Student</button>
      </form>

      <h2>Student List</h2>
      <ul>
        {students.map((student) => (
          <li key={student.student_id}>
            {student.full_name} ({student.class})
            <button onClick={() => handleEdit(student)}>Edit</button>
            <button onClick={() => handleDelete(student.student_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
