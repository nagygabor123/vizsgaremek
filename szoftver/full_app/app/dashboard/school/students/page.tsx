"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { Pen, X, Lock, ArrowUpDown, CirclePlus, LockKeyholeOpen, LockKeyhole, LockOpen} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import '../../../globals.css';

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


  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

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
      //setIsModalOpen(false);
      setOpen(false);
      setIsDialogOpen(false);
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
    //setIsModalOpen(true);
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
    try {
      const scheduleResponse = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${student_id}`);
  
      if (!scheduleResponse.ok) {
        console.error('Nem sikerült lekérni a diák órarendjét.');
        return;
      }
  
      const schedule = await scheduleResponse.json();
      const { first_class_start, last_class_end } = schedule;
  
      // Az aktuális idő HH:MM formátumban
      const currentTime = new Date().toTimeString().slice(0, 5);
  
      // Ellenőrizzük, hogy az aktuális idő az órarendi időintervallumba esik-e
      if (currentTime >= first_class_start && currentTime <= last_class_end) {
        const response = await fetch(`http://localhost:3000/api/system/studentAccess?student=${student_id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) {
          console.error('Hiba történt a zárolás feloldásakor:', await response.text());
        }else{
          const data = await response.json();
          console.log(data.message);
        }
      } else {
        console.warn('A diák jelenleg nincs órán, nem lehet feloldani.');
      }
    } catch (error) {
      console.error('Hiba történt a kérés során:', error);
    }
  };
  
  



  const [sortField, setSortField] = useState<"full_name" | "class" | null>(null);

  const [sortOrder, setSortOrder] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [searchClass, setSearchClass] = useState("");
  


  // Rendezési logika
  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0;
    const fieldA = String(a[sortField] ?? "").toLowerCase();
    const fieldB = String(b[sortField] ?? "").toLowerCase();
    
    return sortOrder === "asc" ? fieldA.localeCompare(fieldB, "hu") : fieldB.localeCompare(fieldA, "hu");
  });

  // Szűrés
  const filteredStudents = sortedStudents.filter(student => 
    student.full_name.toLowerCase().includes(searchName.toLowerCase()) &&
    student.class.toLowerCase().includes(searchClass.toLowerCase())
  );

  // Rendezés váltása adott mező szerint
  const toggleSort = (field: "full_name" | "class") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  



  const PAGE_SIZE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredStudents.length / PAGE_SIZE);
  
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );


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
    <div>
  




      <div className="p-4">
         
         
  
         
      <div className="flex gap-2 mb-4">
  <div className="flex gap-2">
    <Input
      type="text"
      placeholder="Keresés név szerint..."
      className="border p-2 rounded w-1/3"
      value={searchName}
      onChange={(e) => setSearchName(e.target.value)}
    />
    <Input
      type="text"
      placeholder="Keresés osztály szerint..."
      className="border p-2 rounded w-1/3"
      value={searchClass}
      onChange={(e) => setSearchClass(e.target.value)}
    />

    <Button variant="outline" onClick={handleSystemClose} > {/*className="ml-auto" */}
  {systemClose ? <LockKeyholeOpen/> : <LockKeyhole/> }
    {systemClose ? 'Feloldás' : 'Zárolás'}
  
  </Button>
  </div>
  



  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
      <Button variant="outline" className="ml-auto" ><CirclePlus/> Új tanuló hozzáadás</Button>
      </DialogTrigger>
      <DialogContent>
    <DialogHeader>
      <DialogTitle>Tanuló hozzáadása</DialogTitle>
      <DialogDescription>
      <div>
        <Input 
            type="text"
        placeholder="Student_id"
          name="student_id"
         // value={formData.student_id}
          onChange={e => setFormData({ ...formData, student_id: e.target.value })}
        />
        <Input
          type="text"
          name="full_name"
          placeholder="Full Name"
         // value={formData.full_name}
          onChange={e => setFormData({ ...formData, full_name: e.target.value })}
        />
        <Input
          type="text"
          name="class"
          placeholder="Class"
         // value={formData.class}
          onChange={e => setFormData({ ...formData, class: e.target.value })}
        />
        <Input
          type="text"
          name="rfid_tag"
          placeholder="RFID Tag"
         //  value={formData.rfid_tag}
          onChange={e => setFormData({ ...formData, rfid_tag: e.target.value })}
        />
      </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
    <form onSubmit={handleSubmit}>
  <Button type="submit">
   Kész
  </Button> {/* {editing}     {editing ? 'Update' : 'Add'} Student*/}
</form>
    
    </DialogFooter>
  </DialogContent>
</Dialog>


</div>

{/*<table className="rounded-lg text-left border border-separate border-tools-table-outline border-black border-1 w-full">
    <thead className="" >
      <th className="rounded-tl-sm bg-yellow-200 pl-12">One</th>
      <th className="rounded-tr-sm bg-yellow-200 pl-12">Two</th>
    </thead>
    <tbody className="rounded-b-sm">
      <tr>
        <td className="bg-blue-100 pl-12">1</td>
        <td className="bg-blue-100 pl-12">2</td>
      </tr>

      <tr>
        <td className="rounded-bl-sm bg-blue-100 pl-12">1</td>
        <td className="rounded-br-sm bg-blue-100 pl-12">2</td>
      </tr>
    </tbody>
  </table>*/}

      {/* border-collapse border border-gray-300      bg-gray-100*/}
      {/* <div className="rounded-md border mt-5">
      <table className=" w-full">
  <thead className="text-center text-sm text-neutral-500 "  >
    <tr>
      <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("full_name")}>
        Teljes név <ArrowUpDown className="w-4 h-4 inline-block" />
      </th>
      <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("class")}>
        Osztály <ArrowUpDown className="w-4 h-4 inline-block" />
      </th>
      <th className="p-2 font-normal">Státusz</th>
      <th className="p-2 font-normal">Műveletek</th>
    </tr>
  </thead>
  <tbody>
    {filteredStudents.map((student, index) => {
      const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
      const currentTime = new Date().toTimeString().slice(0, 5);
      const canUnlockStudent = systemClose || (studentTimetableData &&
        currentTime >= studentTimetableData.first_class_start &&
        currentTime <= studentTimetableData.last_class_end);

      return (
        <tr 
          key={student.student_id} 
          className="text-center border-t"
        >
          <td className="p-1">{student.full_name}</td>
          <td className="p-1">{student.class}</td>
          <td className="p-1">
            {student.status === "ki" ? (
              <span className="text-red-500">●</span>
            ) : student.status === "be" ? (
              <span className="text-green-500">●</span>
            ) : null}
          </td>
          <td className="p-1">
            
        
<Button variant="ghost" onClick={() => handleStudentOpen(student.student_id)} disabled={!canUnlockStudent}><LockOpen className="w-4 h-4 inline-block"/></Button>


<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button variant="ghost" onClick={() => handleEdit(student)}><Pen /></Button>
      </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Tanuló szerkesztése</DialogTitle>
      <DialogDescription>
      <div>
      
        <Input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={e => setFormData({ ...formData, full_name: e.target.value })}
        />
        <Input
          type="text"
          name="class"
          placeholder="Class"
          value={formData.class}
          onChange={e => setFormData({ ...formData, class: e.target.value })}
        />
        <Input
          type="text"
          name="rfid_tag"
          placeholder="RFID Tag"
          value={formData.rfid_tag}
          onChange={e => setFormData({ ...formData, rfid_tag: e.target.value })}
        />
      </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
    <form onSubmit={handleSubmit}>
  <Button type="submit">
   Kész
  </Button> 
</form>
    
    </DialogFooter>
  </DialogContent>
</Dialog>



<Button variant="ghost" onClick={() => handleDelete(student.student_id)}><X /></Button>

         
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
</div> */}
    
{/* {editing}     {editing ? 'Update' : 'Add'} Student*/}

<div className="rounded-md border mt-5">
    <table className="w-full">
      <thead className="text-center text-sm text-neutral-500">
        <tr>
          <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("full_name")}>Teljes név <ArrowUpDown className="w-4 h-4 inline-block" /></th>
          <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("class")}>Osztály <ArrowUpDown className="w-4 h-4 inline-block" /></th>
          <th className="p-2 font-normal">Státusz</th>
          <th className="p-2 font-normal">Műveletek</th>
        </tr>
      </thead>
      <tbody>
        {paginatedStudents.map((student) => {
          const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
          const currentTime = new Date().toTimeString().slice(0, 5);
          const canUnlockStudent = systemClose || (studentTimetableData &&
            currentTime >= studentTimetableData.first_class_start &&
            currentTime <= studentTimetableData.last_class_end);

          return (
            <tr key={student.student_id} className="text-center border-t">
              <td className="p-1">{student.full_name}</td>
              <td className="p-1">{student.class}</td>
              <td className="p-1">
                {student.status === "ki" ? <span className="text-red-500">●</span> : student.status === "be" ? <span className="text-green-500">●</span> : null}
              </td>
              <td className="p-1">
              
                <Button variant="ghost" onClick={() => handleStudentOpen(student.student_id)} disabled={!canUnlockStudent}><LockOpen className="w-4 h-4 inline-block"/></Button>
                <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button variant="ghost" onClick={() => handleEdit(student)}><Pen /></Button>
      </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Tanuló szerkesztése</DialogTitle>
      <DialogDescription>
      <div>
      
        <Input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={e => setFormData({ ...formData, full_name: e.target.value })}
        />
        <Input
          type="text"
          name="class"
          placeholder="Class"
          value={formData.class}
          onChange={e => setFormData({ ...formData, class: e.target.value })}
        />
        <Input
          type="text"
          name="rfid_tag"
          placeholder="RFID Tag"
          value={formData.rfid_tag}
          onChange={e => setFormData({ ...formData, rfid_tag: e.target.value })}
        />
      </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
    <form onSubmit={handleSubmit}>
  <Button type="submit">
   Kész
  </Button> 
</form>
    
    </DialogFooter>
  </DialogContent>
</Dialog>

                <Button variant="ghost" onClick={() => handleDelete(student.student_id)}><X /></Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>

    {/* Lapozó gombok */}


        </div>

        <div className="flex justify-between items-center p-2">
      <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Előző</Button>
      <span>Oldal {currentPage} / {totalPages}</span>
      <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Következő</Button>
    </div>
  </div>
        
    </div>


    

    </SidebarInset>
    </SidebarProvider>
  );
}
