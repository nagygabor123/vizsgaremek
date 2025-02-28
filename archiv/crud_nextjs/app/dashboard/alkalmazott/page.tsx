'use client';

import { useState, useEffect } from 'react';

export default function AddEmployeePage() {
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]); // Az alkalmazottak tárolására
  const positions = [
    { label: 'Igazgató', value: 'igazgato' },
    { label: 'Osztályfőnök', value: 'osztalyfonok' },
    { label: 'Tanár', value: 'tanar' },
    { label: 'Portás', value: 'portas' },
  ];
  // Alkalmazottak lekérése
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/config/getEmployees');
      const data = await response.json();

      if (response.ok) {
        setEmployees(data);
      } else {
        setMessage('Error fetching employees');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    }
  };

  useEffect(() => {
    fetchEmployees(); // Az alkalmazottak betöltése oldal betöltésekor
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/config/addEmployees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          position: position,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Employee added successfully');
        setFullName('');
        setPosition('');
        fetchEmployees(); // Frissítjük az alkalmazottak listáját hozzáadás után
      } else {
        setMessage(data.message || 'Error adding employee');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add New Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="position">Position:</label>
          <select
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          >
            {positions.map((possiton) => (
              <option key={possiton.value} value={possiton.value}>
                {possiton.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Employee'}
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>Employees List</h2>
      <ul>
        {employees.length === 0 ? (
          <li>No employees found</li>
        ) : (
          employees.map((employee) => (
            <li key={employee.admin_id}>
              {employee.full_name} - {employee.position} (ID: {employee.admin_id})
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
