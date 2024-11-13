// pages/users.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ student_id: '', full_name: '', class: '', rfid_tag: '' });
  const [editing, setEditing] = useState(false);  // Track if we're editing a user

  // Felhasználók betöltése
  useEffect(() => {
    async function fetchUsers() {
      const res = await axios.get('/api/students/read');
      setUsers(res.data);
    }
    fetchUsers();
  }, []);

  // Új felhasználó hozzáadása
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      // Update existing student
      await axios.put('/api/students/update', form);
    } else {
      // Create new student
      await axios.post('/api/students/create', form);
    }
    setForm({ full_name: '', class: '', rfid_tag: '', student_id: '' });
    setEditing(false);
    const res = await axios.get('/api/students/read');
    setStudents(res.data);
  };

  // Felhasználó törlése
  const handleDelete = async (student_id) => {
    await axios.delete('/api/students/delete', { data: { student_id } });
    const res = await axios.get('/api/students/read');
    setStudents(res.data);
  };

  // Felhasználó szerkesztése (adatok kitöltése az űrlapon)
  const handleEdit = (student) => {
    setForm({
      student_id: student.student_id,
      full_name: student.full_name,
      class: student.class,
      rfid_tag: student.rfid_tag,
    });
    setEditing(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Diákok</h1>

      {/* Student List */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-gray-600">OM azonosító</th>
              <th className="py-2 px-4 text-left text-gray-600">Név</th>
              <th className="py-2 px-4 text-left text-gray-600">Osztály</th>
              <th className="py-2 px-4 text-left text-gray-600">RFID címke</th>
              <th className="py-2 px-4 text-left text-gray-600">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_id} className="border-t">
                <td className="py-2 px-4">{student.student_id}</td>
                <td className="py-2 px-4">{student.full_name}</td>
                <td className="py-2 px-4">{student.class}</td>
                <td className="py-2 px-4">{student.rfid_tag}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEdit(student)}
                    className="text-blue-500 hover:text-blue-700 font-semibold mr-4"
                  >
                    Frissítés
                  </button>
                  <button
                    onClick={() => handleDelete(student.student_id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Törlés
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Form */}
      <div className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">{editing ? 'Diák frissítése' : 'Új diák hozzáadása'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="OM azonosító"
              value={form.student_id}
              onChange={(e) => setForm({ ...form, student_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Név"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Osztály"
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="RFID címke"
              value={form.rfid_tag}
              onChange={(e) => setForm({ ...form, rfid_tag: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {editing ? 'Frissítés' : 'Diák hozzáadása'}
          </button>
        </form>
      </div>
    </div>
  );
}