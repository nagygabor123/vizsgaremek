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
import { TriangleAlert, Plus, Trash2, Trash, CalendarPlus, CalendarIcon, SaveAll } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"



import * as React from "react"
import { format } from "date-fns"
import { addDays } from 'date-fns';

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


import AppKonfig from '@/components/app-konfig';
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [isDialogOpen3, setIsDialogOpen3] = useState(false);

  const [date, setDate] = React.useState<DateRange | undefined>(undefined);


  const [message, setMessage] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [yearSchedule, setYearSchedule] = useState<any>({
    plusDates: [],
    breakDates: [],
    noSchool: [],
    schoolStart: '',
    schoolEnd: ''
  });
  const [schoolStartEdit, setSchoolStartEdit] = useState('');
  const [schoolEndEdit, setSchoolEndEdit] = useState('');
  const [newBreak, setNewBreak] = useState({ nev: '', which_day: '', replace_day: '' });
  const [newNo, setNewNo] = useState({ nev: '', which_day: '', replace_day: '' });
  const [newPlusDate, setNewPlusDate] = useState({ nev: '', which_day: '', replace_day: '' });



  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
      const plusRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=plusznap');
      const szunetRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=szunet');
      const noschoolRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=tanitasnelkul');
      const startRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=kezd');
      const endRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=veg');

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
    }
  };

  useEffect(() => {
    fetchYearSchedule();
  }, []);

  const updateSchoolYear = async (type: string, date: string) => {
    try {
      console.log('Küldött adatok:', { type, which_day: date });

      const response = await fetch('http://localhost:3000/api/config/setYearStartEnd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, which_day: date }),
      });

      const responseData = await response.json();
      console.log('API válasz:', responseData);

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
      const response = await fetch('http://localhost:3000/api/config/addPlusBreak', {
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
        setNewBreak({ nev: '', which_day: '', replace_day: '' });
        await fetchYearSchedule();


      }
    } catch (error) {
      console.error('Error updating break:', error);
    }
  };

  const handleAddNoSchool = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/config/addPlusBreak', {
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
        setNewNo({ nev: '', which_day: '', replace_day: '' });
        await fetchYearSchedule();
      }
    } catch (error) {
      console.error('Error updating break:', error);
    }
  };

  const handleAddPlusDate = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/config/addPlusBreak', {
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
        setNewPlusDate({ nev: '', which_day: '', replace_day: '' });
        await fetchYearSchedule();
      }
    } catch (error) {
      console.error('Error updating plus date:', error);
    }
  };

  const handleDeletePlusBreak = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/config/deletePlusBreak?year_schedule_id=${id}`, {
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




  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  //const [date, setDate] = React.useState<Date>()
  const [saturdayClasses, setSaturdayClasses] = React.useState<Date[]>([]);
  const [nonTeachingDays, setNonTeachingDays] = React.useState<Date[]>([]);
  const [breaks, setBreaks] = React.useState<{ from: Date, to: Date }[]>([])
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [newSaturdayClass, setNewSaturdayClass] = React.useState<Date | undefined>();
  const [newNonTeachingDay, setNewNonTeachingDay] = React.useState<Date | undefined>();
  // const [newBreak, setNewBreak] = React.useState<Date | undefined>();


  const handleAddRange = () => {
    if (dateRange?.from instanceof Date && dateRange?.to instanceof Date) {
      setBreaks(prevBreaks => [
        ...prevBreaks, // Fontos: ne töröljük az előző elemeket!
        { from: dateRange.from as Date, to: dateRange.to as Date }
      ]);
    } else {
      console.error("Invalid date range. Both 'from' and 'to' must be valid Date objects.");
    }
  };


  const handleAddDate = (date: Date | undefined, setState: React.Dispatch<React.SetStateAction<Date[]>>, state: Date[]) => {
    if (date) setState([...state, date]);
  };



  const [isOverlayVisible, setOverlayVisible] = useState(false);
  // const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    city: "",
    profession: "",
    hobby: "",
    experience: "",
    feedback: "",
  });

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  const handleButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFormSubmit = () => {
    console.log("Form Data:", formData);
    setOverlayVisible(false);
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
    window.location.reload();
  };

  const handleClose = () => {
    setOverlayVisible(false);
  };



  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  if (isButtonVisible === null) {
    return null;
  }

  {/*console.log("BreakDates:", yearSchedule?.breakDates);*/ }


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
                  <BreadcrumbPage>Rendszer</BreadcrumbPage>
                </BreadcrumbItem> */}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tanév beállításai</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/*<div className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
          <div className="grid auto-rows-min gap-4 w-full">
            {isButtonVisible && (
              <div className="aspect-[18/1] rounded-xl bg-red-100 flex items-center px-4 w-full box-border overflow-hidden">
                <TriangleAlert className="text-red-500" />
                <p className="text-sm truncate ml-3">
                  A rendszer nincs teljesen beállítva. Kérjük, végezze el a szükséges konfigurációt!
                </p>
                <AppKonfig />


              </div>
            )}


          </div>
        </div>*/}

        <div className="p-4">


          {/* {message && (
            <p style={{ marginTop: '20px', color: message.startsWith('Error') ? 'red' : 'green' }}>
              {message}
            </p>
          )}
          {apiResponse && (
            <pre style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px' }}>
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          )} */}



          {/* <input
            type="date"
            value={schoolStartEdit}
            onChange={(e) => setSchoolStartEdit(e.target.value)}
          />
          <button onClick={() => updateSchoolYear('kezd', schoolStartEdit)}>Mentés</button> */}


<h1 className="text-2xl mb-10 font-semibold">Aktív tanév: 2024/2025</h1>



          <div className="mt-5 mb-5 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">

      

            <div className="sm:w-1/4 w-full">
              <h2 className="text-lg font-semibold">Tanítási év első napja</h2>
              <p className="text-sm text-neutral-500">
                Válassza ki a tanév első napját, majd mentse el.
              </p>
            </div>


            <div className="sm:w-3/4 w-full space-y-3">
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            " justify-start text-left font-normal w-full sm:w-auto ",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {startDate
                            ? format(startDate, "PPP")
                            : schoolStartEdit
                              ? format(schoolStartEdit, "PPP")
                              : <span>Válasszon egy dátumot</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) => setStartDate(date ?? undefined)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>


                    <Button
                      onClick={async () => {
                        if (!startDate) return;
                        const formattedDate = format(startDate, "yyyy-MM-dd");
                        await updateSchoolYear("kezd", formattedDate);
                        await fetchYearSchedule();  // Újra lekéri az adatokat a szerverről
                        setStartDate(undefined);    // Visszaállítja a kiválasztott dátumot
                      }}
                      disabled={!startDate}
                      variant="outline"
                      size="icon"
                    >
                      <SaveAll className="w-4 h-4 inline-block" />
                    </Button>



                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />
          <div className="mt-5 mb-5 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">

            <div className="sm:w-1/4 w-full">
              <h2 className="text-lg font-semibold">Tanítási év utolsó napja</h2>
              <p className="text-sm text-neutral-500">
                Válassza ki a tanév utolsó napját, majd mentse el.
              </p>
            </div>

            <div className="sm:w-3/4 w-full space-y-3">
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-full sm:w-auto",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {endDate
                            ? format(endDate, "PPP")
                            : schoolEndEdit
                              ? format(schoolEndEdit, "PPP")
                              : <span>Válasszon egy dátumot</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(date) => setEndDate(date ?? undefined)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>


                    <Button
                      onClick={async () => {
                        if (!endDate) return;
                        const formattedDate = format(endDate, "yyyy-MM-dd");
                        await updateSchoolYear("veg", formattedDate);
                        await fetchYearSchedule();  // Újra lekéri az adatokat a szerverről
                        setEndDate(undefined);    // Visszaállítja a kiválasztott dátumot
                      }}
                      disabled={!endDate}
                      variant="outline"
                      size="icon"
                    >
                      <SaveAll className="w-4 h-4 inline-block" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />
          <div className="mt-5 mb-5 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
            {/* Cím és leírás */}
            <div className="sm:w-1/4 w-full">
              <h2 className="text-lg font-semibold">Tanítás nélküli munkanapok</h2>
              <p className="text-sm text-neutral-500">
                Itt láthatóak azok a napok, amikor nincs tanítás.
              </p>
            </div>

            {/* Táblázat és gomb */}
            <div className="sm:w-3/4 w-full">
              {/* Gomb a táblázat felett */}
              <div className="flex justify-start sm:justify-end mb-3">
                <Dialog
                  open={isDialogOpen3}
                  onOpenChange={(isOpen) => {
                    setIsDialogOpen3(isOpen);
                    if (!isOpen) {
                      setSelectedDate(null);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <CalendarPlus className="w-4 h-4 inline-block mr-2" /> Új nap hozzáadás
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px]"

                  >
                    <DialogHeader>
                      <DialogTitle>Tanítás nélküli munkanap hozzáadása</DialogTitle>
                      <DialogDescription>
                        Aliquam metus eros, tristique nec semper id, congue eget metus
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid items-start gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Dátum</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                " justify-start text-left font-normal",
                                !selectedDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {selectedDate ? format(new Date(selectedDate), "PPP") : (
                                <span>2025. május 20.</span>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate ? new Date(selectedDate) : undefined}
                              onSelect={(date) => {
                                if (!date) return;
                                const originalDate = format(date, "yyyy-MM-dd");
                                const whichDayDate = new Date(originalDate);
                                whichDayDate.setDate(whichDayDate.getDate() - 1);

                                const replaceDayDate = new Date(originalDate);
                                const replaceDay = replaceDayDate.toISOString().split('T')[0];
                                const whichDay = whichDayDate.toISOString().split('T')[0];

                                setSelectedDate(originalDate);
                                setNewNo({
                                  ...newNo,
                                  which_day: whichDay,
                                  replace_day: replaceDay,
                                  nev: whichDay
                                });
                              }}
                              initialFocus
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>


                    </div>

                    <DialogFooter>

                      <Button className="w-full" onClick={handleAddNoSchool}>Mentés </Button>

                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Görgethető táblázat kis képernyőn */}
              <div className="rounded-xl border overflow-x-auto">
                {yearSchedule?.noSchool?.length > 0 ? (
                  <table className="w-full min-w-max">
                    <thead className="text-center text-sm text-neutral-500">
                      <tr>
                        <th className="p-2 cursor-pointer font-normal">Dátum</th>
                        <th className="p-2 cursor-pointer font-normal">Művelet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearSchedule.noSchool.map((noSchoolPeriod: any) => (
                        <tr key={noSchoolPeriod.id} className="text-center border-t">
                          <td className="p-1">{noSchoolPeriod.end}</td>
                          <td className="p-1">
                            <Button

                              variant="ghost"
                              onClick={() => handleDeletePlusBreak(noSchoolPeriod.id)}
                            >
                              <Trash2 className="w-4 h-4 inline-block" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center p-3 text-neutral-500">
                    Nincs megjelenítendő tanítási nélküli munkanap
                  </div>
                )}
              </div>
            </div>
          </div>








          <Separator />
          <div className="mt-5 mb-5 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
            <div className="sm:w-1/4 w-full">
              <h2 className="text-lg font-semibold">Szombati tanítási napok</h2>
              <p className="text-sm text-neutral-500">
                Itt láthatóak a rendkívüli tanítási napok és a helyettesítő napok.
              </p>
            </div>
            <div className="sm:w-3/4 w-full">

              <div className="flex justify-start sm:justify-end mb-3">
                <Dialog open={isDialogOpen2} onOpenChange={(isOpen) => setIsDialogOpen2(isOpen)}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <CalendarPlus className="w-4 h-4 inline-block mr-2" /> Új nap hozzáadás
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px]"

                  >
                    <DialogHeader>
                      <DialogTitle>Szombati tanítási nap hozzáadása</DialogTitle>
                      <DialogDescription>
                        Aliquam metus eros, tristique nec semper id, congue eget metus
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid items-start gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Dátum</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                " justify-start text-left font-normal",
                                !newPlusDate.which_day && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {newPlusDate.which_day ? format(new Date(newPlusDate.which_day), "PPP") : (
                                <span>2025. április 14.</span>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={newPlusDate.which_day ? new Date(newPlusDate.which_day) : undefined}
                              onSelect={(date) => {
                                if (!date) return;
                                const formattedDate = format(date, "yyyy-MM-dd");
                                setNewPlusDate({ ...newPlusDate, which_day: formattedDate, nev: formattedDate });
                              }}
                              initialFocus
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="position">Helyettesítő nap</Label>
                        <Select
                          value={newPlusDate.replace_day}
                          onValueChange={(value) => setNewPlusDate({ ...newPlusDate, replace_day: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Válasszon..." />
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
                      <Button className="w-full" onClick={handleAddPlusDate}>Mentés </Button>

                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-xl border overflow-x-auto">
                {yearSchedule?.plusDates?.length > 0 ? (
                  <table className="w-full min-w-max">
                    <thead className="text-center text-sm text-neutral-500">
                      <tr>
                        <th className="p-2 cursor-pointer font-normal">Dátum</th>
                        <th className="p-2 cursor-pointer font-normal">Helyettesítő nap</th>
                        <th className="p-2 cursor-pointer font-normal">Művelet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearSchedule.plusDates.map((plusDate: any) => (
                        <tr key={plusDate.id} className="text-center border-t">
                          <td className="p-1">{plusDate.date}</td>
                          <td className="p-1">{plusDate.replaceDay}</td>
                          <td className="p-1">
                            <Button variant="ghost" onClick={() => handleDeletePlusBreak(plusDate.id)}>
                              <Trash2 className="w-4 h-4 inline-block" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center p-3 text-neutral-500">
                    Nincs megjelenítendő szombati tanítási nap
                  </div>
                )}
              </div>
            </div>
          </div>



          <Separator />
          <div className="mt-5 mb-5 flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
            <div className="sm:w-1/4 w-full">
              <h2 className="text-lg font-semibold">Tanítási szünetek</h2>
              <p className="text-sm text-neutral-500">Az iskola hivatalos szünetei és időtartamuk.</p>
            </div>

            <div className="sm:w-3/4 w-full">
              <div className="flex justify-start sm:justify-end mb-3">

                <Dialog open={isDialogOpen} onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <CalendarPlus className="w-4 h-4 inline-block mr-2" /> Új szünet hozzáadás
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px]"

                  >
                    <DialogHeader>
                      <DialogTitle>Szünet hozzáadása</DialogTitle>
                      <DialogDescription>
                        Aliquam metus eros, tristique nec semper id, congue eget metus
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid items-start gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Név</Label>
                        <Input
                          type="text"
                          placeholder="Tavaszi szünet"
                          value={newBreak.nev}
                          onChange={(e) => setNewBreak({ ...newBreak, nev: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="position">Dátum</Label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {date?.from ? (
                                date.to ? (
                                  <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(date.from, "LLL dd, y")
                                )
                              ) : (
                                <span>2025. április 14. - 2025. máju 20.</span>
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
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
                      <Button className="w-full" onClick={handleAddBreak}>Mentés</Button>

                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>

              <div className="rounded-xl border overflow-x-auto max-w-full">
                {yearSchedule?.breakDates?.filter((breakPeriod: any) => breakPeriod.type === "szunet").length > 0 ? (
                  <table className="min-w-full table-auto">
                    <thead className="text-center text-sm text-neutral-500">
                      <tr>
                        <th className="p-2 cursor-pointer font-normal">Név</th>
                        <th className="p-2 cursor-pointer font-normal">Időtartam</th>
                        <th className="p-2 cursor-pointer font-normal">Művelet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearSchedule.breakDates
                        .filter((breakPeriod: any) => breakPeriod.type === "szunet")
                        .map((breakPeriod: any) => (
                          <tr key={breakPeriod.id} className="text-center border-t">
                            <td className="p-1 truncate">{breakPeriod.name}</td>
                            <td className="p-1">{breakPeriod.start} - {breakPeriod.end}</td>
                            <td className="p-1">
                              <Button variant="ghost" onClick={() => handleDeletePlusBreak(breakPeriod.id)}>
                                <Trash2 className="w-4 h-4 inline-block" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center p-3 text-neutral-500">Nincs megjelenítendő tanítási szünet</div>

                )}
              </div>
            </div>
          </div>

        </div>

      </SidebarInset>
    </SidebarProvider>
  );
}


