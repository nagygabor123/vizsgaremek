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

import { Label } from "@/components/ui/label"
import Link from "next/link";

import { Pen, X, ArrowUpDown, TriangleAlert, CirclePlus, CircleCheck, LockKeyholeOpen, LockKeyhole, LockOpen, CircleAlert, CircleMinus, Lock, ChevronRight, ChevronLeft, CircleX } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import '../../../globals.css';

import AppKonfig from '@/components/app-konfig';



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

  useEffect(() => {
      const fetchTimetables = async () => {
        try {
          // Fetch all students' timetable data at once from the new API endpoint
          const response = await fetch('http://localhost:3000/api/timetable/allScheduleStart');
          if (!response.ok) {
            throw new Error('Nem sikerült lekérni az összes diák órarendjét.');
          }
    
          const data = await response.json();
          // Map the response to match the structure of your state
          const timetables = data.students.map((student: any) => ({
            student_id: student.student_id,
            first_class_start: student.first_class_start,
            last_class_end: student.last_class_end,
          }));
    
          setStudentTimetable(timetables);
        } catch (error) {
          console.error('Hiba történt az órarendek lekérésekor:', error);
        }
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
      setFormData({ student_id: '', full_name: '', class: '', rfid_tag: '', status: '' });
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
        } else {
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


  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  if (isButtonVisible === null) {
    return null; 
  }

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
                {/* <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Adminisztráció</BreadcrumbPage>
                </BreadcrumbItem>*/}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tanulók</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>




        <div className="overflow-x-auto">




        <div className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
            <div className="grid auto-rows-min gap-4 w-full">
            {isButtonVisible && ( 
              <div className="aspect-[18/1] rounded-xl bg-red-100 flex items-center px-4 w-full box-border overflow-hidden">
                <TriangleAlert className="text-red-500" />
                <p className="text-sm truncate ml-3">
                A rendszer nincs beállítva. Kérjük, végezze el a szükséges konfigurációt!
                </p>
                  {/* <Button
                onClick={handleButtonClick}
                className="ml-auto"
                variant="link"
              >
                Konfigurálás most
              </Button> */}
              <AppKonfig/>
              </div>
            )} 
              {/* ide jönne a kód */}

            </div>
          </div>

          <div className="p-4">




            <div className="flex flex-col gap-2 md:flex-row mb-4">
              <div className="flex flex-col gap-2 md:flex-row">
                <Input
                  type="text"
                  placeholder="Keresés név szerint..."
                  className="border p-2 rounded"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Keresés osztály szerint..."
                  className="border p-2 rounded"
                  value={searchClass}
                  onChange={(e) => setSearchClass(e.target.value)}
                />
                {/* <Select>
                <SelectTrigger > 
                  <SelectValue placeholder="Keresés osztály szerint..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Osztályok</SelectLabel>
                    <SelectItem value="13i">13.I</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select> */}

                <Button variant="outline" onClick={handleSystemClose} > {/*className="ml-auto" */}
                  {systemClose ? <LockOpen /> : <Lock />} {/*   Keyhole  */}
                  {systemClose ? 'Összes feloldás' : 'Összes zárolás'}

                </Button>
              </div>




              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-auto" ><CirclePlus /> Új tanuló hozzáadás</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Tanuló hozzáadása</DialogTitle>
                                <DialogDescription>
                                Aliquam metus eros, tristique nec semper id, congue eget metus.
                                </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="grid items-start gap-4">
      <div className="grid gap-2">
        <Label  htmlFor="student_id">Azonosító szám</Label>
                          <Input
                           className="col-span-3"
                            type="text"
                            placeholder="OM1234567"
                            name="student_id"
                            // value={formData.student_id}
                            onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                          />
      </div>
      <div className="grid gap-2">
      <Label htmlFor="full_name">Teljes név</Label>
                          <Input
                           className="col-span-3"
                            type="text"
                            name="full_name"
                            placeholder="Teszt Elek"
                            // value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                          />
      </div>
      <div className="grid gap-2">
                          <Label htmlFor="class">Osztály</Label>
                          <Input
                           className="col-span-3"
                            type="text"
                            name="class"
                            placeholder="9.I"
                            // value={formData.class}
                            onChange={e => setFormData({ ...formData, class: e.target.value })}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="class">RFID azonosító</Label>
                          <Input
                           className="col-span-3"
                            type="text"
                            name="rfid_tag"
                            placeholder="R6HF6K86"
                            //  value={formData.rfid_tag}
                            onChange={e => setFormData({ ...formData, rfid_tag: e.target.value })}
                          />
                        </div>


      <Button type="submit">Mentés</Button>
    </form>

                                {/* <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right" htmlFor="student_id">Azonosító szám</Label>
                          <Input
                           className="col-span-3"
                            type="text"
                            placeholder="Azonosító szám"
                            name="student_id"
                            // value={formData.student_id}
                            onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right" htmlFor="full_name">Teljes név</Label>
                          <Input
                           className="col-span-3"
                            type="text"
                            name="full_name"
                            placeholder="Teljes név"
                            // value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right" htmlFor="class">Osztály</Label>
                          <Input
                           className="col-span-3"
                            type="text"
                            name="class"
                            placeholder="Osztály"
                            // value={formData.class}
                            onChange={e => setFormData({ ...formData, class: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right" htmlFor="class">RFID azonosító</Label>
                          <Input
                           className="col-span-3"
                            type="text"
                            name="rfid_tag"
                            placeholder="RFID azonosító"
                            //  value={formData.rfid_tag}
                            onChange={e => setFormData({ ...formData, rfid_tag: e.target.value })}
                          />
                        </div>
                      </div>
    
                  <DialogFooter>
                    <form onSubmit={handleSubmit}>
                      <Button type="submit">
                        Mentés
                      </Button> 
                    </form>

                  </DialogFooter> */}
                </DialogContent>
              </Dialog>



            </div>

   



            <div className="rounded-md border mt-5">
              <table className="w-full">
                <thead className="text-center text-sm text-neutral-500">
                  <tr>
                    <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("full_name")}>Teljes név <ArrowUpDown className="w-4 h-4 inline-block" /></th>
                    <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("class")}>Osztály <ArrowUpDown className="w-4 h-4 inline-block" /></th>
                    <th className="p-2 font-normal">Státusz</th>
                    <th className="p-2 font-normal">RFID azonosító</th>
                    <th className="p-2 font-normal">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {
                  
                  students.length === 0 ? (
                    <tr className="text-center border-t">
                      <td className="p-1">
                        Nincs megjelenítendő diák
                      </td>
                    </tr>
                  ) : (
                  
                  
                  paginatedStudents.map((student) => {
                    const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
                    const currentTime = new Date().toTimeString().slice(0, 5);
                    const canUnlockStudent = systemClose || (studentTimetableData &&
                      currentTime >= studentTimetableData.first_class_start &&
                      currentTime <= studentTimetableData.last_class_end);

                    return (
                      <tr key={student.student_id} className="text-center text-sm border-t">
                        <td className="p-1">{student.full_name}</td>
                        <td className="p-1">{student.class}</td>
                        <td className="p-1">
                          {student.status === "ki" ? <span className="text-gray-500"><CircleMinus className="w-4 h-4 inline-block"/></span>: student.status === "be" ? <span className="text-green-500"><CircleCheck className="w-4 h-4 inline-block"/></span> : <span className="text-red-500"><CircleAlert className="w-4 h-4 inline-block"/></span>}

                         
                        </td>
                        <td className="p-1">{student.rfid_tag}</td>
                        <td className="p-1">

                          <Button variant="ghost" onClick={() => handleStudentOpen(student.student_id)} disabled={!canUnlockStudent}> <LockOpen className="w-4 h-4 inline-block" /> {/* {canUnlockStudent ? <LockOpen className="w-4 h-4 inline-block" /> : <LockOpen className="w-4 h-4 inline-block" />}*/}</Button>
                          <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" onClick={() => handleEdit(student)}><Pen /></Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Tanuló szerkesztése</DialogTitle>
                                <DialogDescription>

                                  Aliquam metus eros, tristique nec semper id, congue eget metus
                                </DialogDescription>
                              </DialogHeader>

                              <form onSubmit={handleSubmit} className="grid items-start gap-4">
                              <div className="grid gap-2">
                                  <Label  htmlFor="full_name">Teljes név</Label>
                                  <Input
                                    className="col-span-3"
                                    type="text"
                                    name="full_name"
                                    placeholder=""
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                  />
                                </div>
                         

                              {/*<Input
                                      type="text"
                                      name="class"
                                      placeholder="Class"
                                      value={formData.class}
                                      onChange={e => setFormData({ ...formData, class: e.target.value })}
                                    />*/}

                        
                                <div className="grid gap-2">
                                  <Label  htmlFor="rfid_tag">RFID azonosító</Label>
                                  <Input
                                    className="col-span-3"
                                    type="text"
                                    name="rfid_tag"
                                    placeholder=""
                                    value={formData.rfid_tag}
                                    onChange={e => setFormData({ ...formData, rfid_tag: e.target.value })}
                                  />
                                </div>
                           


                              <Button type="submit">Mentés</Button>
                              </form>
                              {/* <DialogFooter>
                                <form onSubmit={handleSubmit}>
                                  <Button type="submit">
                                    Mentés
                                  </Button>
                                </form>

                              </DialogFooter> */}
                            </DialogContent>
                          </Dialog>

                          <Button variant="ghost" onClick={() => handleDelete(student.student_id)}><X /></Button>
                        </td>
                     
                      </tr>
                    );
                  })
                  )}
                </tbody>
              </table>

              {/* Lapozó gombok */}


            </div>

            <div className="flex justify-between items-center p-2">
              <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}> <ChevronLeft /> Előző</Button>
              <span> {currentPage} / {totalPages}</span>
              <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Következő <ChevronRight /></Button>
            </div>
          </div>

        </div>




      </SidebarInset>
    </SidebarProvider>
  );
}
