"use client";

import { useState, useEffect, useMemo } from "react";
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
  //Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pen, Trash2, ArrowUpDown, CirclePlus, ChevronLeft, ChevronRight, Slash } from "lucide-react"

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  //DialogFooter
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  // SelectGroup,
  // SelectLabel
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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



export default function AddEmployeePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [osztaly, setOsztaly] = useState('');
  const [, setMessage] = useState('');
  const [employees, setEmployees] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [shortname, setShortName] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editOsztaly, setEditOsztaly] = useState('');
  const [hasStudents, setHasStudents] = useState<boolean | null>(null);
  const [loading2, setLoading2] = useState(true);

  const API_BASE_URL = window.location.origin;

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/read`);
      const data = await response.json();
      setHasStudents(data.length > 0);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading2(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const positions = [
    { label: 'Igazgató', value: 'igazgato' },
    { label: 'Igazgatóhelyettes', value: 'igazgatohelyettes' },
    { label: 'Portás', value: 'portas' },
    { label: 'Rendszergazda', value: 'rendszergazda' },
  ];

  const osztalyfonokOptions = useMemo(() => {
    return Array.from(new Set(employees.map((employee) => employee.osztalyfonok)))
  }, [employees]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/getEmployees`);
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
    // setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/config/addEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, position: position, osztalyfonok: 'nincs', short_name: shortname }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Employee added successfully');
        setFullName('');
        setShortName('');
        setPosition('');
        setOsztaly('');
        fetchEmployees();
        setIsDialogOpen(false);
        setOpen(false);
        fetchEmployees();
        // setOpen(false);

      } else {
        setMessage(data.message || 'Error adding employee');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    } finally {
      //setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/deleteEmployee?admin_id=${id}`, {
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
    setEditOsztaly(employee.osztalyfonok);
  };

  const handleUpdate = async () => {
    if (!editId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/config/updateEmployee`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_id: editId, full_name: editName, position: editPosition, osztalyfonok: editOsztaly }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Employee updated successfully');
        setEditId(null);
        setEditName('');
        setEditPosition('');
        setEditOsztaly('');

        setOpen(false);
        setIsDialogOpen(false);
        fetchEmployees();


      } else {
        setMessage(data.message || 'Error updating employee');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    }
  };


  const [sortField, setSortField] = useState<"full_name" | "position" | "osztalyfonok" | null>(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [searchOsztalyfonok, setSearchOsztalyfonok] = useState("");

  const sortedEmployees = [...employees].sort((a, b) => {
    if (!sortField) return 0;
    const fieldA = String(a[sortField] ?? "").toLowerCase();
    const fieldB = String(b[sortField] ?? "").toLowerCase();

    return sortOrder === "asc" ? fieldA.localeCompare(fieldB, "hu") : fieldB.localeCompare(fieldA, "hu");
  });

  /*const filteredEmployees = sortedEmployees.filter(student =>
    student.full_name.toLowerCase().includes(searchName.toLowerCase()) &&
    student.position.toLowerCase().includes(searchPosition.toLowerCase()) &&
    student.osztalyfonok.toLowerCase().includes(searchOsztalyfonok.toLowerCase())
  );*/
  const filteredEmployees = sortedEmployees.filter(employee => {
    const positionLabel = positions.find(pos => pos.value === employee.position)?.label || employee.position;

    return (
      employee.full_name.toLowerCase().includes(searchName.toLowerCase()) &&
      positionLabel.toLowerCase().includes(searchPosition.toLowerCase()) &&
      employee.osztalyfonok.toLowerCase().includes(searchOsztalyfonok.toLowerCase())
    );
  });

  const toggleSort = (field: "full_name" | "position" | "osztalyfonok") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  /*
    const filteredOsztalyfonok = osztalyfonokOptions.filter((osztalyfonok) =>
      osztalyfonok.toLowerCase().includes(searchOsztalyfonok.toLowerCase())
    );
  */

  const PAGE_SIZE = 14;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const paginatedEmployees = filteredEmployees.slice(
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
                  <BreadcrumbPage>Munkatársak</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="overflow-x-auto">

          <div>
            {loading2 ? (
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
                        placeholder="Keresés pozíció szerint..."
                        className="border p-2 rounded-md"
                        value={searchPosition}
                        onChange={(e) => setSearchPosition(e.target.value)}
                      />

                      <Select
                        value={searchOsztalyfonok}
                        onValueChange={setSearchOsztalyfonok}
                      >
                        <SelectTrigger className="col-span-3" id="searchOsztalyfonok">
                          <SelectValue placeholder="Keresés osztály szerint..." />
                        </SelectTrigger>
                        <SelectContent>
                          {osztalyfonokOptions.map((osztalyfonok) => (
                            <SelectItem key={osztalyfonok} value={osztalyfonok}>
                              {osztalyfonok}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="ml-auto" ><CirclePlus /> Új alkalmazott hozzáadás</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Alkalmazott hozzáadása</DialogTitle>
                          <DialogDescription></DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="grid items-start gap-4">

                          <div className="grid gap-2">
                            <Label htmlFor="fullName">Teljes név</Label>
                            <Input
                              className="col-span-3"
                              id="fullName"
                              name="full_name"
                              type="text"
                              placeholder="Teszt Elek"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="shortName">Rövidített név (felhasználónév)</Label>
                            <Input
                              className="col-span-3"
                              id="shortName"
                              name="short_name"
                              type="text"
                              placeholder="TeEl"
                              value={shortname}
                              onChange={(e) => setShortName(e.target.value)}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="jelszo">Ideiglenes jelszó</Label>
                            <Input
                              disabled
                              className="col-span-3"
                              id="jelszo"
                              type="text"
                              placeholder={`${shortname}123`} />
                          </div>

                          <div className="grid gap-2 w-full">
                            <Label htmlFor="position">Pozíció</Label>
                            <Select value={position} onValueChange={setPosition}>
                              <SelectTrigger
                                data-testid="position-select"
                                className="col-span-3 w-full"
                              >
                                <SelectValue placeholder="Válasszon..." />
                              </SelectTrigger>
                              <SelectContent>
                                {positions.map((pos) => (
                                  <SelectItem key={pos.value} value={pos.value}>
                                    {pos.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/*{["tanar", "igazgato"].includes(position) && (*/}
                          {/*   <div className="grid gap-2">
          <Label htmlFor="osztaly">Van osztálya?</Label>
          <Select value={osztaly} onValueChange={setOsztaly}>
            <SelectTrigger className="col-span-3 w-full">
              <SelectValue placeholder="Válasszon..." />
            </SelectTrigger>
            <SelectContent>
              {osztalyfonokOptions.map((osztalyfonok) => (
                <SelectItem key={osztalyfonok} value={osztalyfonok}>
                  {osztalyfonok}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>*/}
                          {/*)}*/}

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
                          <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("position")}>Pozíció  <ArrowUpDown className="w-4 h-4 inline-block" /></th>
                          <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("osztalyfonok")}>Osztály <ArrowUpDown className="w-4 h-4 inline-block" /></th>
                          <th className="p-2 cursor-pointer font-normal">Műveletek</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center p-6 h-dvh text-base text-muted-foreground">
                              Nem szerepel alkalmazott a rendszerben
                            </td>
                          </tr>
                        ) : (

                          paginatedEmployees.map((employee) => (
                            <tr key={employee.admin_id} className="text-center border-t">
                              <td className="p-1">{employee.full_name} ({employee.short_name})</td>
                              <td className="p-1">
                                {positions.find((pos) => pos.value === employee.position)?.label || employee.position}
                              </td>
                              <td className="p-1">{employee.osztalyfonok}</td>
                              <td className="p-1">

                                <Dialog open={open} onOpenChange={setOpen}>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" onClick={() => handleEdit(employee)} data-testid="edit-button" >
                                      <Pen />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Alkalmazott szerkesztése</DialogTitle>
                                      <DialogDescription></DialogDescription>
                                    </DialogHeader>

                                    <div className="grid items-start gap-4">

                                      <div className="grid gap-2">
                                        <Label htmlFor="fullName">Teljes név</Label>
                                        <Input
                                          className="col-span-3"
                                          id="fullName"
                                          name="full_name"
                                          type="text"
                                          placeholder=""
                                          value={editName}
                                          onChange={(e) => setEditName(e.target.value)}
                                        />
                                      </div>

                                      <div className="grid gap-2">
                                        <Label htmlFor="position">Pozíció</Label>
                                        <Select onValueChange={setEditPosition}>
                                          <SelectTrigger className="col-span-3 w-full">
                                            <SelectValue placeholder="Válasszon..." />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {positions.map((pos) => (
                                              <SelectItem key={pos.value} value={pos.value}>
                                                {pos.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      {/*  <div className="grid gap-2">
                      <Label htmlFor="position">Van osztálya?</Label>
                      <Select value={editOsztaly} onValueChange={setEditOsztaly}>
                        <SelectTrigger className="col-span-3 w-full">
                          <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                          {osztalyfonokOptions.map((osztalyfonok) => (
                            <SelectItem key={osztalyfonok} value={osztalyfonok}>
                              {osztalyfonok}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>*/}

                                      <Button onClick={handleUpdate} >Mentés</Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                  <AlertDialogTrigger disabled={employee.position === 'Tanár' || employee.position === "igazgato" || employee.position === "igazgatohelyettes"} >
                                    <Button disabled={employee.position === 'Tanár' || employee.position === "igazgato" || employee.position === "igazgatohelyettes"} variant="ghost"><Trash2 className="w-4 h-4 inline-block" data-testid="delete-button" /></Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Biztosan törölni szeretné az alkalmazottat?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Ez a művelet nem vonható vissza. Az alkalmazott véglegesen törlésre kerül, és az adatai eltávolításra kerülnek a rendszerből.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Mégse</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(employee.admin_id)}>Véglegesítés</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center p-2 ">
                    <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}> <ChevronLeft /> Előző</Button>
                    <span> {currentPage} / {totalPages}</span>
                    <Button variant="ghost" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Következő  <ChevronRight /></Button>
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
