"use client";  // Add this line at the top

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import '../../../globals.css';



import { AppSidebar } from "@/components/app-sidebar"
import {
   ChevronDown,

} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  useSidebar,

} from "@/components/ui/sidebar"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";

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
      setSystemClose(data.status === "nyitva" ? false : true);
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
    setEditingStudent({ ...student });
    setIsEditModalOpen(true);
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



  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterClass, setFilterClass] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchStudents();
  }, []);


  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterClass ? student.class.toLowerCase().includes(filterClass.toLowerCase()) : true) &&
    (filterStatus ? student.status === filterStatus : true)
  );



  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (editingStudent) {
      setEditingStudent({ ...editingStudent, [e.target.name]: e.target.value });
    }
  };

  const handleSaveEdit = async () => {
    if (editingStudent) {
      await fetch('/api/students/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent),
      });
      setIsEditModalOpen(false);
      setEditingStudent(null);
      fetchStudents();
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
      <BreadcrumbPage>Tanulók</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
          </div>
        </header>
        <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Students</h1>
      <div className="mb-4 flex gap-2">
        <Input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Input type="text" placeholder="Filter by class..." value={filterClass} onChange={(e) => setFilterClass(e.target.value)} />
        <Input type="text" placeholder="Filter by status..." value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} />
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Full Name</th>
            <th className="border px-4 py-2">Class</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.student_id} className="border-t">
              <td className="border px-4 py-2">{student.full_name}</td>
              <td className="border px-4 py-2">{student.class}</td>
              <td className="border px-4 py-2">{student.status}</td>
              <td className="border px-4 py-2 space-x-2">
                <Button variant="outline" onClick={() => handleEdit(student)}>Edit</Button>
                <Button variant="destructive" onClick={() => handleDelete(student.student_id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <>
              <Input type="text" name="full_name" placeholder="Full Name" value={editingStudent.full_name} onChange={handleEditChange} />
              <Input type="text" name="class" placeholder="Class" value={editingStudent.class} onChange={handleEditChange} />
              <Input type="text" name="status" placeholder="Status" value={editingStudent.status} onChange={handleEditChange} />
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={handleSaveEdit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
      </SidebarInset>
    </SidebarProvider>
  );
  
}



