// pages/users.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', age: '', id: null });
  const [editing, setEditing] = useState(false);  // Track if we're editing a user

  // Felhasználók betöltése
  useEffect(() => {
    async function fetchUsers() {
      const res = await axios.get('/api/users/read');
      setUsers(res.data);
    }
    fetchUsers();
  }, []);

  // Új felhasználó hozzáadása
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      // Update user
      await axios.put('/api/users/update', form);
    } else {
      // Create new user
      await axios.post('/api/users/create', form);
    }
    setForm({ name: '', email: '', age: '', id: null });
    setEditing(false);  // Reset the editing state
    const res = await axios.get('/api/users/read');
    setUsers(res.data);
  };

  // Felhasználó törlése
  const handleDelete = async (id) => {
    await axios.delete('/api/users/delete', { data: { id } });
    const res = await axios.get('/api/users/read');
    setUsers(res.data);
  };

  // Felhasználó szerkesztése (adatok kitöltése az űrlapon)
  const handleEdit = (user) => {
    setForm({ id: user.id, name: user.name, email: user.email, age: user.age });
    setEditing(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Felhasználók</h1>

      {/* Felhasználói lista */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-gray-600">Név</th>
              <th className="py-2 px-4 text-left text-gray-600">Email</th>
              <th className="py-2 px-4 text-left text-gray-600">Életkor</th>
              <th className="py-2 px-4 text-left text-gray-600">Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.age}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-500 hover:text-blue-700 font-semibold mr-4"
                  >
                    Frissítés
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
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

      {/* Felhasználó hozzáadása / frissítése */}
      <div className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">{editing ? 'Felhasználó frissítése' : 'Új felhasználó hozzáadása'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Név"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Életkor"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {editing ? 'Frissítés' : 'Felhasználó hozzáadása'}
          </button>
        </form>
      </div>
    </div>
  );
}
