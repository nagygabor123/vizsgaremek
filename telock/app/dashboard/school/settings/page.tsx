

"use client";

import { useState, useEffect } from "react";
import * as React from "react"
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import Link from "next/link";
import {
  Trash2,
  CalendarPlus,
  CalendarIcon,
  SaveAll,
  Slash,
  ChevronRight,
  School,
  BookOpen,
  Clock,
  Sun,
  Moon
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import {
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { DateRange } from "react-day-picker";
// UI Components (keep your existing imports)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const start = new Date(yearSchedule.schoolStart);
const end = new Date(yearSchedule.schoolEnd);
const now = new Date();

const startYear = start.getFullYear();
const endYear = end.getFullYear();
const schoolYear = `${startYear}/${endYear}`;

const isYearOver = now > end;

const handleYearChange = () => {
  if (!isYearOver) return;
  alert('Tanév váltása megtörtént (csak példa).');
  // Ide jönne az új tanév beállító logika pl. új API hívás
};




  return (
    <div className="min-h-screen">
      {/* Header */}
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Beállítások és naplózás</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>tanév beállításai</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {/* Main Content */}
      <main className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Current School Year Card */}
        <div className="mb-8">
          <Card className="border-blue-100 bg-blue-50">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-semibold text-blue-800">
                    Jelenlegi tanév
                  </CardTitle>
                  <CardDescription className="text-blue-600">
                    {schoolYear} {isYearOver && <Badge variant="destructive" className="ml-2">Lejárt</Badge>}
                  </CardDescription>
                </div>
                <Button
                  onClick={handleYearChange}
                  disabled={!isYearOver}
                  className={cn(
                    "transition-all",
                    isYearOver
                      ? 'bg-green-600 hover:bg-green-700 shadow-md'
                      : 'bg-gray-300 cursor-not-allowed'
                  )}
                >
                  Új tanév indítása
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* School Year Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
               
                <span>Tanév kezdete</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
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
                    <PopoverContent className="w-auto p-0" align="start">
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
                    variant="default"
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <SaveAll className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Az iskola tanítási évének első napja.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
               
                <span>Tanév vége</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
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
                    <PopoverContent className="w-auto p-0" align="start">
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
                    variant="default"
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <SaveAll className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Az iskola tanítási évének utolsó napja.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No School Days */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                
                  <span>Tanítás nélküli munkanapok</span>
                </CardTitle>
                <CardDescription>
                  Azok a napok, amikor nincs tanítás, de munkanap.
                </CardDescription>
              </div>
              <Dialog
                open={isDialogOpen3}
                onOpenChange={(isOpen) => {
                  setIsDialogOpen3(isOpen);
                  if (!isOpen) setSelectedDate(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Új nap
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tanítás nélküli munkanap hozzáadása</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Dátum</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(new Date(selectedDate), "PPP", { locale: hu }) : "Válasszon dátumot"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={hu}
                            mode="single"
                            selected={selectedDate ? new Date(selectedDate) : undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              const originalDate = format(date, "yyyy-MM-dd");
                              setSelectedDate(originalDate);
                              setNewNo({
                                ...newNo,
                                which_day: originalDate,
                                replace_day: originalDate,
                                nev: originalDate
                              });
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddNoSchool} className="w-full bg-blue-600 hover:bg-blue-700">
                      Mentés
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {yearSchedule?.noSchool?.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dátum
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Művelet
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {yearSchedule.noSchool.map((noSchoolPeriod: any) => (
                      <tr key={noSchoolPeriod.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(noSchoolPeriod.end).toLocaleDateString("hu-HU")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className=" hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  A tanítás nélküli nap véglegesen törlődni fog.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeletePlusBreak(noSchoolPeriod.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Törlés
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nincs rögzített tanítás nélküli munkanap
              </div>
            )}
          </CardContent>
        </Card>

        {/* Saturday School Days */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                 
                  <span>Szombati tanítási napok</span>
                </CardTitle>
                <CardDescription>
                  Azok a szombati napok, amikor tanítás van.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Új nap
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Szombati tanítási nap hozzáadása</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Dátum</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !newPlusDate.which_day && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newPlusDate.which_day 
                              ? format(new Date(newPlusDate.which_day), "PPP", { locale: hu }) 
                              : "Válasszon dátumot"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={hu}
                            mode="single"
                            selected={newPlusDate.which_day ? new Date(newPlusDate.which_day) : undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              const formattedDate = format(date, "yyyy-MM-dd");
                              setNewPlusDate({ ...newPlusDate, which_day: formattedDate, nev: formattedDate });
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="day">Órarendi nap</Label>
                      <Select
                        value={newPlusDate.replace_day}
                        onValueChange={(value) => setNewPlusDate({ ...newPlusDate, replace_day: value })}
                      >
                        <SelectTrigger className="w-full">
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
                    <Button onClick={handleAddPlusDate} className="w-full bg-blue-600 hover:bg-blue-700">
                      Mentés
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {yearSchedule?.plusDates?.length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dátum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Órarendi nap
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Művelet
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {yearSchedule.plusDates.map((plusDate: any) => (
                      <tr key={plusDate.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(plusDate.date).toLocaleDateString("hu-HU")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {days.find((day) => day.value === plusDate.replaceDay)?.label || plusDate.replaceDay}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className=" hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  A szombati tanítási nap véglegesen törlődni fog.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeletePlusBreak(plusDate.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Törlés
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nincs rögzített szombati tanítási nap
              </div>
            )}
          </CardContent>
        </Card>

        {/* School Breaks */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                 
                  <span>Tanítási szünetek</span>
                </CardTitle>
                <CardDescription>
                  Az iskola tanítási szünetei és időtartamuk.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Új szünet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Szünet hozzáadása</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Név</Label>
                      <Input
                        id="name"
                        placeholder="Téli szünet"
                        value={newBreak.nev}
                        onChange={(e) => setNewBreak({ ...newBreak, nev: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="date-range">Időtartam</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-range"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
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
                              <span>Válasszon dátumtartományt</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
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
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddBreak} className="w-full bg-blue-600 hover:bg-blue-700">
                      Mentés
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {yearSchedule?.breakDates?.filter((b: any) => b.type === "szunet").length > 0 ? (
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Név
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Időtartam
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Művelet
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {yearSchedule.breakDates
                      .filter((breakPeriod: any) => breakPeriod.type === "szunet")
                      .map((breakPeriod: any) => (
                        <tr key={breakPeriod.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {breakPeriod.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(breakPeriod.start).toLocaleDateString("hu-HU")} -{" "}
                            {new Date(breakPeriod.end).toLocaleDateString("hu-HU")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className=" hover:text-red-900">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    A tanítási szünet véglegesen törlődni fog.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Mégse</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeletePlusBreak(breakPeriod.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Törlés
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nincs rögzített tanítási szünet
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}