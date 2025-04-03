"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { useSession } from "next-auth/react";
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
import { Trash2, CalendarPlus, ChevronRight, Save, CalendarIcon, PlusCircle, CalendarHeart, CalendarOff, CalendarX, SaveAll, Slash } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

import * as React from "react"
import { format } from "date-fns"
import { hu } from "date-fns/locale";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


import { cn } from "@/lib/utils"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { DateRange } from 'react-day-picker';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

export default function Page() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [isDialogOpen3, setIsDialogOpen3] = useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [message, setMessage] = useState<string>('');
  const [yearSchedule, setYearSchedule] = useState<any>({
    plusDates: [],
    breakDates: [],
    noSchool: [],
    schoolStart: '',
    schoolEnd: ''
  });
  const [schoolStartEdit, setSchoolStartEdit] = useState('');
  const [schoolEndEdit, setSchoolEndEdit] = useState('');
  const [newBreak, setNewBreak] = useState({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
  const [newNo, setNewNo] = useState({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
  const [newPlusDate, setNewPlusDate] = useState({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const API_BASE_URL = window.location.origin;

  useEffect(() => {
    if (!isDialogOpen3) {
      setSelectedDate(null);
    }
  }, [isDialogOpen3]);


  const days = [
    { label: 'Hétfő', value: 'monday' },
    { label: 'Kedd', value: 'tuesday' },
    { label: 'Szerda', value: 'wednesday' },
    { label: 'Csütörtök', value: 'thursday' },
    { label: 'Péntek', value: 'friday' },
  ];

  const fetchYearSchedule = async () => {
    try {
      const plusRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=plusznap`);
      const szunetRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=szunet`);
      const noschoolRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=tanitasnelkul`);
      const startRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=kezd`);
      const endRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?school_id=${session?.user?.school_id}&type=veg`);

      const plusDates = await plusRes.json();
      const breakDates = await szunetRes.json();
      const schoolStart = await startRes.json();
      const schoolEnd = await endRes.json();
      const noSchool = await noschoolRes.json();

      setYearSchedule({
        plusDates: plusDates.plusDates_alap,
        breakDates: breakDates.breakDates_alap,
        noSchool: noSchool.tanitasnelkul_alap,
        schoolStart: schoolStart.schoolYearStart.start,
        schoolEnd: schoolEnd.schoolYearEnd.end
      });
      setSchoolStartEdit(schoolStart.schoolYearStart.start);
      setSchoolEndEdit(schoolEnd.schoolYearEnd.end);
    } catch (error) {
      console.error('Error fetching year schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearSchedule();
  }, []);

  const updateSchoolYear = async (type: string, date: string) => {
    try {
      //console.log('Küldött adatok:', { type, which_day: date });

      const response = await fetch(`${API_BASE_URL}/api/config/setYearStartEnd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, which_day: date }),
      });

      //const responseData = await response.json();
      //console.log('API válasz:', responseData);

      if (response.ok) {
        setMessage(`${type === 'kezd' ? 'Tanév kezdete' : 'Tanév vége'} sikeresen frissítve!`);

        setYearSchedule({
          ...yearSchedule,
          schoolStart: type === 'kezd' ? date : yearSchedule.schoolStart,
          schoolEnd: type === 'veg' ? date : yearSchedule.schoolEnd
        });


      } else {
        setMessage('Hiba történt az adat frissítésekor.');
      }
    } catch (error) {
      setMessage(`Hiba: ${error}`);
    }
  };

  const handleAddBreak = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/addPlusBreak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'szunet', ...newBreak })
      });
      if (response.ok) {
        setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          breakDates: [...(prev?.breakDates || []), newBreak]
        }));
        setIsDialogOpen(false);
        setDate(undefined);
        setNewBreak({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
        await fetchYearSchedule();


      }
    } catch (error) {
      console.error('Error updating break:', error);
    }
  };

  const handleAddNoSchool = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/addPlusBreak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'tanitasnelkul', ...newNo })
      });
      if (response.ok) {
        {/*setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          noSchool: [...prev.noSchool, newNo]
        }));*/}

        setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          noSchool: Array.isArray(prev.noSchool) ? [...prev.noSchool, newNo] : [newNo]
        }));

        setIsDialogOpen3(false);
        setNewNo({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
        await fetchYearSchedule();
      }
    } catch (error) {
      console.error('Error updating break:', error);
    }
  };

  const handleAddPlusDate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/addPlusBreak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'plusznap', ...newPlusDate })
      });
      if (response.ok) {
        // setYearSchedule((prev: typeof yearSchedule) => ({
        //   ...prev,
        //   plusDates: [...prev.plusDates, newPlusDate]
        // }));

        setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          plusDates: [...(prev.plusDates ?? []), newPlusDate],
        }));
        setIsDialogOpen2(false);
        setNewPlusDate({ nev: '', which_day: '', replace_day: '', school_id: session?.user?.school_id });
        await fetchYearSchedule();
      }
    } catch (error) {
      console.error('Error updating plus date:', error);
    }
  };

  const handleDeletePlusBreak = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/deletePlusBreak?year_schedule_id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('A rekord sikeresen törölve.');
        setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          breakDates: prev.breakDates?.filter((breakPeriod: any) => breakPeriod.id !== id) || [],
          noSchool: prev.noSchool?.filter((noSchoolPeriod: any) => noSchoolPeriod.id !== id) || [],
          plusDates: prev.plusDates?.filter((plusDate: any) => plusDate.id !== id) || []
        }));
      } else {
        setMessage('Hiba történt a törlés során.');
      }
    } catch (error) {
      console.error('Hiba a törlés során:', error);
      setMessage('Hiba történt a törlés során.');
    }
  };


  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  if (isButtonVisible === null) {
    return null;
  }

  return (
<div className="min-h-screen bg-gray-50">
  {/* Fejléc */}
  <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-white/95 backdrop-blur-md px-4">
    <div className="flex items-center gap-4">
      <SidebarTrigger />
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="hover:text-primary">Kezdőlap</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primary">Tanév beállításai</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>

  {/* Fő tartalom */}
  <main className="p-6 max-w-6xl mx-auto">
    {loading ? (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        {/* <Loader2 className="h-8 w-8 animate-spin text-primary" /> */}
      </div>
    ) : (
      <div className="space-y-8">
        {/* Tanév időszak beállítás */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-2xl font-bold mb-6">Tanév időszak beállítása</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Kezdő dátum */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Tanítási év kezdete</Label>
                <p className="text-sm text-muted-foreground">
                  Az első tanítási nap dátuma
                </p>
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? format(startDate, "PPP", { locale: hu })
                        : schoolStartEdit
                          ? format(schoolStartEdit, "PPP", { locale: hu })
                          : "Válasszon dátumot"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      locale={hu}
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Button
                  onClick={async () => {
                    if (!startDate) return;
                    const formattedDate = format(startDate, "yyyy-MM-dd");
                    await updateSchoolYear("kezd", formattedDate);
                    await fetchYearSchedule();
                    setStartDate(undefined);
                  }}
                  disabled={!startDate}
                  className="shrink-0"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Mentés
                </Button>
              </div>
            </div>
            
            {/* Záró dátum */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Tanítási év vége</Label>
                <p className="text-sm text-muted-foreground">
                  Az utolsó tanítási nap dátuma
                </p>
              </div>
              
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate
                        ? format(endDate, "PPP", { locale: hu })
                        : schoolEndEdit
                          ? format(schoolEndEdit, "PPP", { locale: hu })
                          : "Válasszon dátumot"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      locale={hu}
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Button
                  onClick={async () => {
                    if (!endDate) return;
                    const formattedDate = format(endDate, "yyyy-MM-dd");
                    await updateSchoolYear("veg", formattedDate);
                    await fetchYearSchedule();
                    setEndDate(undefined);
                  }}
                  disabled={!endDate}
                  className="shrink-0"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Mentés
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tanítás nélküli napok */}
        <section className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold">Tanítás nélküli munkanapok</h2>
                <p className="text-sm text-muted-foreground">
                  Azok a napok, amikor nincs tanítás, de munkanap
                </p>
              </div>
              
              <Dialog
                open={isDialogOpen3}
                onOpenChange={(isOpen) => {
                  setIsDialogOpen3(isOpen);
                  if (!isOpen) setSelectedDate(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Új nap hozzáadása
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tanítás nélküli nap hozzáadása</DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Dátum</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(new Date(selectedDate), "PPP", { locale: hu }) : (
                              "Válasszon dátumot"
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={hu}
                            mode="single"
                            selected={selectedDate ? new Date(selectedDate) : undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              setSelectedDate(format(date, "yyyy-MM-dd"));
                              setNewNo({
                                ...newNo,
                                which_day: format(date, "yyyy-MM-dd"),
                                replace_day: format(date, "yyyy-MM-dd"),
                                nev: format(date, "yyyy-MM-dd")
                              });
                            }}
                            initialFocus
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleAddNoSchool} className="w-full">
                      Mentés
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              {yearSchedule?.noSchool?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Dátum</TableHead>
                      <TableHead className="text-right">Műveletek</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearSchedule.noSchool.map((noSchoolPeriod: any) => (
                      <TableRow key={noSchoolPeriod.id}>
                        <TableCell>
                          {new Date(noSchoolPeriod.end).toLocaleDateString("hu-HU")}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  A tanítás nélküli nap véglegesen törlődik a rendszerből.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeletePlusBreak(noSchoolPeriod.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Törlés
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <CalendarOff className="mx-auto h-8 w-8 mb-2" />
                  <p>Nincs rögzített tanítás nélküli nap</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Szombati tanítási napok */}
        <section className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold">Szombati tanítási napok</h2>
                <p className="text-sm text-muted-foreground">
                  Azok a szombati napok, amikor tanítás van
                </p>
              </div>
              
              <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Új nap hozzáadása
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Szombati tanítási nap hozzáadása</DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Dátum</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !newPlusDate.which_day && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newPlusDate.which_day ? format(new Date(newPlusDate.which_day), "PPP", { locale: hu }) : (
                              "Válasszon dátumot"
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={hu}
                            mode="single"
                            selected={newPlusDate.which_day ? new Date(newPlusDate.which_day) : undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              const formattedDate = format(date, "yyyy-MM-dd");
                              setNewPlusDate({ 
                                ...newPlusDate, 
                                which_day: formattedDate, 
                                nev: formattedDate 
                              });
                            }}
                            initialFocus
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="day">Órarendi nap</Label>
                      <Select
                        value={newPlusDate.replace_day}
                        onValueChange={(value) => setNewPlusDate({ ...newPlusDate, replace_day: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Válasszon napot..." />
                        </SelectTrigger>
                        <SelectContent>
                          {days.map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleAddPlusDate} className="w-full">
                      Mentés
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              {yearSchedule?.plusDates?.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Dátum</TableHead>
                      <TableHead>Órarendi nap</TableHead>
                      <TableHead className="text-right">Műveletek</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearSchedule.plusDates.map((plusDate: any) => (
                      <TableRow key={plusDate.id}>
                        <TableCell>
                          {new Date(plusDate.date).toLocaleDateString("hu-HU")}
                        </TableCell>
                        <TableCell>
                          {days.find((day) => day.value === plusDate.replaceDay)?.label || plusDate.replaceDay}
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  A szombati tanítási nap véglegesen törlődik a rendszerből.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeletePlusBreak(plusDate.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Törlés
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <CalendarX className="mx-auto h-8 w-8 mb-2" />
                  <p>Nincs rögzített szombati tanítási nap</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Tanítási szünetek */}
        <section className="bg-white rounded-xl shadow-sm border">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold">Tanítási szünetek</h2>
                <p className="text-sm text-muted-foreground">
                  Az iskola hivatalos tanítási szünetei
                </p>
              </div>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Új szünet hozzáadása
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tanítási szünet hozzáadása</DialogTitle>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Szünet neve</Label>
                      <Input
                        id="name"
                        placeholder="Téli szünet"
                        value={newBreak.nev}
                        onChange={(e) => setNewBreak({ ...newBreak, nev: e.target.value })}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="date-range">Időszak</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            id="date-range"
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "PPP", { locale: hu })} -{" "}
                                  {format(date.to, "PPP", { locale: hu })}
                                </>
                              ) : (
                                format(date.from, "PPP", { locale: hu })
                              )
                            ) : (
                              "Válasszon időszakot"
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            locale={hu}
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={(selected) => {
                              setDate(selected);
                              setNewBreak((prev) => ({
                                ...prev,
                                which_day: selected?.from
                                  ? format(selected.from, "yyyy-MM-dd")
                                  : "",
                                replace_day: selected?.to
                                  ? format(selected.to, "yyyy-MM-dd")
                                  : "",
                              }));
                            }}
                            numberOfMonths={2}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleAddBreak} className="w-full">
                      Mentés
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              {yearSchedule?.breakDates?.filter((b: any) => b.type === "szunet").length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Név</TableHead>
                      <TableHead>Időszak</TableHead>
                      <TableHead className="text-right">Műveletek</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {yearSchedule.breakDates
                      .filter((breakPeriod: any) => breakPeriod.type === "szunet")
                      .map((breakPeriod: any) => (
                        <TableRow key={breakPeriod.id}>
                          <TableCell className="font-medium">
                            {breakPeriod.name}
                          </TableCell>
                          <TableCell>
                            {new Date(breakPeriod.start).toLocaleDateString("hu-HU")} -{" "}
                            {new Date(breakPeriod.end).toLocaleDateString("hu-HU")}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    A tanítási szünet véglegesen törlődik a rendszerből.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Mégse</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeletePlusBreak(breakPeriod.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Törlés
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <CalendarHeart className="mx-auto h-8 w-8 mb-2" />
                  <p>Nincs rögzített tanítási szünet</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    )}
  </main>
</div>
  );
}


