"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useSession } from "next-auth/react";
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
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { Label } from "@/components/ui/label"
import Link from "next/link";

import { Pen, Trash2, ArrowUpDown, CirclePlus, CircleCheck, LockOpen, CircleAlert, CircleMinus, Lock, ChevronRight, ChevronLeft, Slash, } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import '../../../globals.css';

import AppKonfig from '@/components/app-konfig';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
  const [, setEditStudentId] = useState<string | null>(null); //editStudentId,
  const [systemClose, setSystemClose] = useState<boolean>(false);
  const [unlockedStudents, setUnlockedStudents] = useState(new Set());
  const [hasStudents, setHasStudents] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = window.location.origin;

  const fetchStudents = async () => {
    try {

      const response = await fetch(`${API_BASE_URL}/api/students/read`);
      const data = await response.json();
      setStudents(data);
      setHasStudents(data.length > 0);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStatus = async () => {

    const response = await fetch(`${API_BASE_URL}/api/system/status`);
    if (response.ok) {
      const data = await response.json();
      setSystemClose(data.status === "nyithato" ? false : true);
    }
  };

  //   const fetchStudentTimetable = async (student_id: string) => {
  //     const response = await fetch(`http://localhost:3000/api/timetable/scheduleStart?student=${student_id}`);
  //     const data = await response.json();
  //     return data;
  //   };

  useEffect(() => {
    fetchStudents();
    fetchSystemStatus();
  }, []);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {

        const response = await fetch(`${API_BASE_URL}/api/timetable/allScheduleStart?school_id=${session?.user?.school_id}`);
        if (!response.ok) {
          throw new Error('Nem sikerült lekérni az összes diák órarendjét.');
        }

        const data = await response.json();
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

  //   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setFormData({
  //       ...formData,
  //       [name]: value,
  //     });
  //   };

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
      fetchStudents();
      //setIsModalOpen(false);
      setOpen(false);
      setIsDialogOpen(false);
    }
  };

  const handleDelete = async (student_id: string) => {
    const response = await fetch('/api/students/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_id }),
    });

    if (response.ok) {
      fetchStudents();
    }
  };

  const handleEdit = (student: Student) => {
    setFormData(student);
    setEditing(true);
    setEditStudentId(student.student_id);
    //setIsModalOpen(true);
  };

  const handleSystemClose = async () => {
    const action = systemClose ? 'open' : 'close';
    const response = await fetch('/api/system/closeOpen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    if (response.ok) {
      setSystemClose((prevState) => !prevState);
    }
  };

  const handleStudentOpen = async (student_id: string) => {
    try {

      const response = await fetch(`${API_BASE_URL}/api/system/studentAccess?student=${student_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        console.error('Hiba történt a zárolás feloldásakor:', await response.text());
      } else {
        const data = await response.json();
        console.log(data.message);
        setUnlockedStudents(prev => new Set(prev).add(student_id));
      }
    } catch (error) {
      console.error('Hiba történt a kérés során:', error);
    }
  };

  const [sortField, setSortField] = useState<"full_name" | "class" | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [searchClass, setSearchClass] = useState("");

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0;
    const fieldA = String(a[sortField] ?? "").toLowerCase();
    const fieldB = String(b[sortField] ?? "").toLowerCase();

    return sortOrder === "asc" ? fieldA.localeCompare(fieldB, "hu") : fieldB.localeCompare(fieldA, "hu");
  });

  const filteredStudents = sortedStudents.filter(student =>
    student.full_name.toLowerCase().includes(searchName.toLowerCase()) &&
    student.class.toLowerCase().includes(searchClass.toLowerCase())
  );

  const toggleSort = (field: "full_name" | "class") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const PAGE_SIZE = 14;
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
                    <Link href="/dashboard">Kezdőlap</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Iskolai nyilvántartás</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Tanulók</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="overflow-x-auto">
          <div>
            {loading ? (
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
              </div>
            ) : (
              <>
                {!hasStudents && <AppKonfig />}
                <div className="p-4">

                  <div className="flex flex-col gap-2 md:flex-row mb-4">
                    <div className="flex flex-col gap-2 md:flex-row">
                      <Input
                        type="text"
                        placeholder="Keresés név szerint..."
                        className="border p-2 rounded-md"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Keresés osztály szerint..."
                        className="border p-2 rounded-md"
                        value={searchClass}
                        onChange={(e) => setSearchClass(e.target.value)}
                      />

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
                          <DialogDescription></DialogDescription>

                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="grid items-start gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="student_id">Azonosító szám</Label>
                            <Input
                              id="student_id"
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
                              id="full_name"
                              className="col-span-3"
                              type="text"
                              name="full_name"
                              placeholder="Teszt Elek"
                              // value={formData.full_name}
                              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="class">Osztály és csoportok</Label>
                            <Input
                              id="class"
                              className="col-span-3"
                              type="text"
                              name="class"
                              placeholder="9.I,9.I-A2"
                              // value={formData.class}
                              onChange={e => setFormData({ ...formData, class: e.target.value })}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="class">RFID azonosító</Label>
                            <Input
                              id="rfid_tag"
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

                      </DialogContent>
                    </Dialog>

                  </div>

                  <div className="rounded-md border mt-5">
                    <table className="w-full">
                      <thead className="text-center text-sm text-muted-foreground">
                        <tr>
                          <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("full_name")}>Teljes név <ArrowUpDown className="w-4 h-4 inline-block" /></th>
                          <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("class")}>Osztály és csoportok<ArrowUpDown className="w-4 h-4 inline-block" /></th>
                          <th className="p-2 font-normal">Státusz</th>
                          {/* <th className="p-2 font-normal">RFID azonosító</th> */}
                          <th className="p-2 font-normal">Műveletek</th>
                        </tr>
                      </thead>
                      <tbody>

                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-6 h-dvh text-base text-muted-foreground">
                              Nem szerepel tanuló a rendszerben
                            </td>
                          </tr>
                        ) : (

                          paginatedStudents.map((student) => {
                            const studentTimetableData = studentTimetable.find(t => t.student_id === student.student_id);
                            const currentTime = new Date().toLocaleString('hu-HU', {
                              timeZone: 'Europe/Budapest',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            });

                            const canUnlockStudent = systemClose || (studentTimetableData &&
                              currentTime >= studentTimetableData.first_class_start &&
                              currentTime <= studentTimetableData.last_class_end);

                            return (
                              <tr key={student.student_id} className="text-center text-sm border-t">
                                <td className="p-1">{student.full_name}</td>
                                <td className="p-1">{student.class}</td>
                                <td className="p-1">
                                  {student.status === "ki" ? <Button disabled size="icon" variant="ghost"><CircleMinus className="w-4 h-4 inline-block" /></Button> : student.status === "be" ? <span className="text-green-500"><CircleCheck className="w-4 h-4 inline-block" /></span> : <span className="text-red-500"><CircleAlert className="w-4 h-4 inline-block" /></span>}
                                </td>
                                {/* <td className="p-1">{student.rfid_tag}</td> */}
                                <td className="p-1">

                                  <Button
                                    variant="ghost"
                                    onClick={() => handleStudentOpen(student.student_id)}
                                    disabled={!canUnlockStudent || unlockedStudents.has(student.student_id)}
                                  >
                                    <LockOpen className="w-4 h-4 inline-block" />
                                  </Button>

                                  <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" onClick={() => handleEdit(student)} data-testid="edit-button"><Pen /></Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                      <DialogHeader>
                                        <DialogTitle>Tanuló szerkesztése</DialogTitle>
                                        <DialogDescription></DialogDescription>

                                      </DialogHeader>

                                      <form onSubmit={handleSubmit} className="grid items-start gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="full_name">Teljes név</Label>
                                          <Input
                                            className="col-span-3"
                                            type="text"
                                            name="full_name"
                                            placeholder=""
                                            value={formData.full_name}
                                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                          />
                                        </div>

                                        <div className="grid gap-2">
                                          <Label htmlFor="rfid_tag">Osztály és csoportok</Label>
                                          <Input
                                            type="text"
                                            name="class"
                                            placeholder=""
                                            value={formData.class}
                                            onChange={e => setFormData({ ...formData, class: e.target.value })}
                                          />
                                        </div>

                                        <div className="grid gap-2">
                                          <Label htmlFor="rfid_tag">RFID azonosító</Label>
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
                                    </DialogContent>
                                  </Dialog>

                                  <AlertDialog>
                                    <AlertDialogTrigger>
                                      <Button variant="ghost" data-testid="delete-button" ><Trash2 /> </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Biztosan törölni szeretné a tanulót?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Ez a művelet nem vonható vissza. A tanuló véglegesen törlésre kerül, és az adatai eltávolításra kerülnek a rendszerből.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Mégse</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(student.student_id)}>Véglegesítés</AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>

                  </div>

                  <div className="flex justify-between items-center p-2">
                    <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}> <ChevronLeft /> Előző</Button>
                    <span> {currentPage} / {totalPages}</span>
                    <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Következő <ChevronRight /></Button>
                  </div>
                </div>
              </>
            )}
          </div>


        </div>

      </SidebarInset>
    </SidebarProvider>
  );
}
