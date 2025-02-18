"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AddEmployeePage() {
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');

  const positions = [
    { label: 'Igazgató', value: 'igazgato' },
    { label: 'Osztályfőnök', value: 'osztalyfonok' },
    { label: 'Tanár', value: 'tanar' },
    { label: 'Portás', value: 'portas' },
    { label: 'Rendszergazda', value: 'rendszergazda' },
  ];

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
    fetchEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/config/addEmployee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, position: position }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Employee added successfully');
        setFullName('');
        setPosition('');
        fetchEmployees();
      } else {
        setMessage(data.message || 'Error adding employee');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/config/deleteEmployee?admin_id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setEmployees(employees.filter(employee => employee.admin_id !== id));
      } else {
        setMessage('Error deleting employee');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    }
  };

  const handleEdit = (employee: any) => {
    setEditId(employee.admin_id);
    setEditName(employee.full_name);
    setEditPosition(employee.position);
  };

  const handleUpdate = async () => {
    if (!editId) return;

    try {
      const response = await fetch('http://localhost:3000/api/config/updateEmployee', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: editId, full_name: editName, position: editPosition }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Employee updated successfully');
        setEditId(null);
        setEditName('');
        setEditPosition('');
        fetchEmployees();
      } else {
        setMessage(data.message || 'Error updating employee');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Főoldal</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Adminisztráció</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Alkalmazottak</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div>
        <h1>Alkalmazottak:</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName">Név:</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="position">Pozició:</label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                {positions.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Hozzáadás...' : 'Alkalmazott hozzáadása'}
            </button>
          </form>

          {message && <p>{message}</p>}
          <h2 className="m-2 text-xl">Alkalmazottak listája</h2>
          <ul>
            {employees.length === 0 ? (
              <li>Nem találom az alkalmazottakat</li>
            ) : (
              employees.map((employee) => (
                <li key={employee.admin_id}>
                  {employee.full_name} - {employee.position} (ID: {employee.admin_id})
                  <button onClick={() => handleDelete(employee.admin_id)} className="ml-2 bg-red-500 text-white p-1 rounded">
                    Törlés
                  </button>
                  <button onClick={() => handleEdit(employee)} className="ml-2 bg-blue-500 text-white p-1 rounded">
                    Frissítés
                  </button>
                </li>
              ))
            )}
          </ul>
          {editId && (
            <div>
              <h3>Alkalmazott szerkesztése</h3>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
              <select value={editPosition} onChange={(e) => setEditPosition(e.target.value)}>
                {positions.map((pos) => (
                  <option key={pos.value} value={pos.value}>{pos.label}</option>
                ))}
              </select>
              <button onClick={handleUpdate} className="bg-green-500 text-white p-1 rounded">Mentés</button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
