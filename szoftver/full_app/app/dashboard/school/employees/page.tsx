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
import { TriangleAlert } from "lucide-react";

import Link from "next/link";


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

      <h2 className="m-2 text-xl">Employees List</h2>
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
    </SidebarInset>
    </SidebarProvider>
  );
}
