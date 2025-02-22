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
import { Pen, X, ArrowUpDown, CirclePlus, ChevronLeft, ChevronRight  } from "lucide-react"
import { Input } from "@/components/ui/input";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function AddEmployeePage() {
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editPosition, setEditPosition] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);


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
        setIsDialogOpen(false);
        //setOpen(false);
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
        setOpen(false);
      } else {
        setMessage(data.message || 'Error updating employee');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    }
  };





  const [sortField, setSortField] = useState<"full_name" | "position" | null>(null);

  const [sortOrder, setSortOrder] = useState("asc");
  const [searchName, setSearchName] = useState("");
  const [searchPosition, setSearchPosition] = useState("");



  // Rendezési logika
  const sortedEmployees = [...employees].sort((a, b) => {
    if (!sortField) return 0;
    const fieldA = String(a[sortField] ?? "").toLowerCase();
    const fieldB = String(b[sortField] ?? "").toLowerCase();

    return sortOrder === "asc" ? fieldA.localeCompare(fieldB, "hu") : fieldB.localeCompare(fieldA, "hu");
  });

  // Szűrés
  const filteredEmployees = sortedEmployees.filter(student =>
    student.full_name.toLowerCase().includes(searchName.toLowerCase()) &&
    student.position.toLowerCase().includes(searchPosition.toLowerCase())
  );

  // Rendezés váltása adott mező szerint
  const toggleSort = (field: "full_name" | "position") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };






  const PAGE_SIZE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);

  const paginatedEmployees = filteredEmployees.slice(
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
                {/*<BreadcrumbItem>
                  <BreadcrumbPage>Adminisztráció</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />*/}
                <BreadcrumbItem>
                  <BreadcrumbPage>Alkalmazottak</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div  className="overflow-x-auto">
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
                  placeholder="Keresés pozíció szerint..."
                  className="border p-2 rounded"
                  value={searchPosition}
                  onChange={(e) => setSearchPosition(e.target.value)}
                />


              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-auto" ><CirclePlus /> Új alkalmazott hozzáadás</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Alkalmazott hozzáadása</DialogTitle>
                    <DialogDescription>
                    Aliquam metus eros, tristique nec semper id, congue eget metus
                                </DialogDescription>
                              </DialogHeader>

                              <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right" htmlFor="fullName">Teljes név</Label>
                        <Input
                         className="col-span-3"
                          id="fullName"
                          type="text"
                          placeholder="Teljes név"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                        </div>


                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="position">Pozíció</Label>
                        <Select value={position} onValueChange={setPosition}>
                          <SelectTrigger  className="col-span-3">
                            <SelectValue placeholder="Pozíció" />
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

                      </div>
              
                  <DialogFooter>
                    <form onSubmit={handleSubmit}>
                      <Button type="submit">
                        Mentés
                      </Button> {/* {editing}     {editing ? 'Update' : 'Add'} Student*/}
                    </form>

                  </DialogFooter>
                </DialogContent>
              </Dialog>



            </div>

            <div className="rounded-md border mt-5">
              <table className="w-full">
                <thead className="text-center text-sm text-neutral-500">
                  <tr>
                    <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("full_name")}>Név  <ArrowUpDown className="w-4 h-4 inline-block" /></th>
                    <th className="p-2 cursor-pointer font-normal" onClick={() => toggleSort("position")}>Pozíció  <ArrowUpDown className="w-4 h-4 inline-block" /></th>
                    <th className="p-2 cursor-pointer font-normal">Műveletek</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr className="text-center border-t">
                      <td className="p-1">
                      Nincs megjelenítendő alkalmazott
                      </td>
                    </tr>
                  ) : (

                    paginatedEmployees.map((employee) => (
                      <tr key={employee.admin_id} className="text-center border-t">
                        <td className="p-1">{employee.full_name}</td>
                        <td className="p-1">
  {positions.find((pos) => pos.value === employee.position)?.label || employee.position}
</td>

                        <td className="p-1">

                          <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" onClick={() => handleEdit(employee)}>
                                <Pen />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[400px]">
                              <DialogHeader>
                                <DialogTitle>Alkalmazott szerkesztése</DialogTitle>
                                <DialogDescription>
                                Aliquam metus eros, tristique nec semper id, congue eget metus.
                                </DialogDescription>
                                </DialogHeader>



                                <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right" htmlFor="fullName">Teljes név</Label>
                                  <Input
                                     className="col-span-3"
                                    id="fullName"
                                    type="text"
                                    placeholder="Teljes név"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                  />
                                </div>

                                <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-right" htmlFor="position">Pozíció</Label>
                                  <Select value={editPosition} onValueChange={setEditPosition}>
                                    <SelectTrigger className="col-span-3"> {/** className="w-[180px]" */}
                                      <SelectValue placeholder="Pozíció" />
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
                              </div>





                      
                              <DialogFooter>

                                <Button onClick={handleUpdate} >Mentés</Button>

                              </DialogFooter>
                            </DialogContent>
                          </Dialog>






                          <Button variant="ghost" onClick={() => handleDelete(employee.admin_id)}><X className="w-4 h-4 inline-block" /></Button>

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
        </div>

        {/*{message && <p>{message}</p>}*/}



      </SidebarInset>
    </SidebarProvider>
  );
}
