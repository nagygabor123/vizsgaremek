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
import { TriangleAlert, Plus, Trash2, Trash, CalendarPlus, CalendarIcon, SaveAll, Slash } from "lucide-react";
import Link from "next/link";

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
  const [loading, setLoading] = useState(true); // Betöltési állapot
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [isDialogOpen3, setIsDialogOpen3] = useState(false);

  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  const API_BASE_URL = window.location.origin;
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
      const plusRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?type=plusznap`);
      const szunetRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?type=szunet`);
      const noschoolRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?type=tanitasnelkul`);
      const startRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?type=kezd`);
      const endRes = await fetch(`${API_BASE_URL}/api/config/getYearSchedule?type=veg`);

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
      setLoading(false); // Lekérés vége
    }
  };

  useEffect(() => {
    fetchYearSchedule();
  }, []);

  const updateSchoolYear = async (type: string, date: string) => {
    try {
      console.log('Küldött adatok:', { type, which_day: date });

      const response = await fetch(`${API_BASE_URL}/api/config/setYearStartEnd`, {
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
        setNewBreak({ nev: '', which_day: '', replace_day: '' });
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
        setNewNo({ nev: '', which_day: '', replace_day: '' });
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
        setNewPlusDate({ nev: '', which_day: '', replace_day: '' });
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
                    <Link href="/dashboard">Kezdőlap</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Beállítások és naplózás</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
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

        <div>
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Üres tartalom, semmi nem jelenik meg a betöltés után */}
            </>
          )}
        </div>

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


          {/* <h1 className="text-2xl mb-10 font-semibold">Aktív tanév: 2024/2025</h1> */}


          <div className="mb-5 flex flex-col sm:flex-row items-start">

            {/* gap-6 sm:gap-10 */}
            <div className="sm:w-1/2 w-full">
              <h2 className="text-lg font-semibold">Tanítási év első napja</h2>
              {/* <p className="text-sm text-muted-foreground mb-2">
                Válassza ki a tanév első napját, majd mentse el.
              </p> */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "justify-start text-left font-normal w-full sm:w-auto",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon />
                            {startDate
                              ? format(startDate, "PPP", { locale: hu })
                              : schoolStartEdit
                                ? format(schoolStartEdit, "PPP", { locale: hu })
                                : <span>Válasszon egy dátumot</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={hu}
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
                          await fetchYearSchedule();
                          setStartDate(undefined);
                        }}
                        disabled={!startDate}
                        variant="outline"
                        size="icon"
                        data-testid="start-save-button"
                      >
                        <SaveAll className="w-4 h-4 inline-block" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Függőleges elválasztó */}
            <div className="hidden sm:block mx-4 h-auto self-stretch custom-thin-border"></div>

            {/* Tanítási év utolsó napja */}
            <div className="sm:w-1/2 w-full">
              <h2 className="text-lg font-semibold">Tanítási év utolsó napja</h2>
              {/* <p className="text-sm text-muted-foreground mb-2">
                Válassza ki a tanév utolsó napját, majd mentse el.
              </p> */}
              <div className="space-y-3">
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
                              ? format(endDate, "PPP", { locale: hu })
                              : schoolEndEdit
                                ? format(schoolEndEdit, "PPP", { locale: hu })
                                : <span>Válasszon egy dátumot</span>}

                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            locale={hu}
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
                          await fetchYearSchedule();
                          setEndDate(undefined);
                        }}
                        disabled={!endDate}
                        variant="outline"
                        size="icon"
                        data-testid="end-save-button"
                      >
                        <SaveAll className="w-4 h-4 inline-block" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <Separator />
          <div className="mt-5 mb-5 flex flex-col gap-3 sm:gap-3">
            <div className="flex justify-between items-start">
              <div className="w-full sm:w-1/2">
                <h2 className="text-lg font-semibold">Tanítás nélküli munkanapok</h2>
                <p className="text-sm text-muted-foreground">
                  Itt láthatóak azok a napok, amikor nincs tanítás.
                </p>
              </div>

              <div>
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
                      <CalendarPlus className="w-4 h-4 inline-block" /> Új nap hozzáadás
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px]"

                  >
                    <DialogHeader>
                      <DialogTitle>Tanítás nélküli munkanap hozzáadása</DialogTitle>
                      {/* <DialogDescription>
                        Aliquam metus eros, tristique nec semper id, congue eget metus
                      </DialogDescription> */}
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
                              {selectedDate ? format(new Date(selectedDate), "PPP", { locale: hu }) : (
                                <span>2025. május 20.</span>
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

                                const originalDate = format(date, "yyyy-MM-dd");
                                const whichDay = originalDate; // Nem vonunk le egy napot!
                                // const replaceDayDate = parseDate(originalDate);
                                // const replaceDay = replaceDayDate.toISOString().split("T")[0];

                                setSelectedDate(originalDate);
                                setNewNo({
                                  ...newNo,
                                  which_day: whichDay, // Marad ugyanaz a nap
                                  replace_day: whichDay,
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
            </div>

            {/* Görgethető táblázat kis képernyőn */}
            <div className="rounded-xl border overflow-x-auto w-full">
              {yearSchedule?.noSchool?.length > 0 ? (
                <table className="w-full min-w-max">
                  <thead className="text-center text-sm text-muted-foreground">
                    <tr>
                      <th className="p-2 cursor-pointer font-normal">Dátum</th>
                      <th className="p-2 cursor-pointer font-normal">Művelet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearSchedule.noSchool.map((noSchoolPeriod: any) => (
                      <tr key={noSchoolPeriod.id} className="text-center border-t">
                        <td className="p-1">
                          {new Date(noSchoolPeriod.end).toLocaleDateString("hu-HU")}</td>

                        <td className="p-1">
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button
                                data-testid="delete-button"
                                variant="ghost"
                              >
                                <Trash2 className="w-4 h-4 inline-block" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Biztosan törölni szeretné ezt a napot?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Ez a művelet nem vonható vissza. A tanítási nélküli munkanap véglegesen törlésre kerül, és az adatai eltávolításra kerülnek a rendszerből.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePlusBreak(noSchoolPeriod.id)}>Véglegesítés</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          {/* <Button

                              variant="ghost"
                              onClick={() => handleDeletePlusBreak(noSchoolPeriod.id)}
                            >
                              <Trash2 className="w-4 h-4 inline-block" />
                            </Button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center p-3 text-muted-foreground">
                  Nincs megjelenítendő tanítási nélküli munkanap
                </div>
              )}
            </div>
          </div>









          <Separator />
          <div className="mt-5 mb-5 flex flex-col gap-3 sm:gap-3">
            <div className="flex justify-between items-start">
              <div className="w-full sm:w-1/2">
                <h2 className="text-lg font-semibold">Szombati tanítási napok</h2>
                <p className="text-sm text-muted-foreground">
                  Itt láthatóak a szombati tanítási napok.
                </p>
              </div>

              <div >  {/**<div className="w-full"> */}
                {/* <div className="flex justify-start sm:justify-end mb-3"> */}
                <Dialog open={isDialogOpen2} onOpenChange={(isOpen) => setIsDialogOpen2(isOpen)}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <CalendarPlus className="w-4 h-4 inline-block" /> Új nap hozzáadás
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px]"

                  >
                    <DialogHeader>
                      <DialogTitle>Szombati tanítási nap hozzáadása</DialogTitle>
                      {/* <DialogDescription>
                        Aliquam metus eros, tristique nec semper id, congue eget metus
                      </DialogDescription> */}
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
                              {newPlusDate.which_day ? format(new Date(newPlusDate.which_day), "PPP", { locale: hu }) : (
                                <span>2025. április 14.</span>
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
                                setNewPlusDate({ ...newPlusDate, which_day: formattedDate, nev: formattedDate });
                              }}
                              initialFocus
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="position">Órarendi nap</Label>
                        <Select
                          value={newPlusDate.replace_day}
                          onValueChange={(value) => setNewPlusDate({ ...newPlusDate, replace_day: value })}
                        >
                          <SelectTrigger className="w-full" data-testid="position-select" >
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
            </div>

            <div className="rounded-xl border overflow-x-auto w-full">
              {yearSchedule?.plusDates?.length > 0 ? (
                <table className="w-full min-w-max">
                  <thead className="text-center text-sm text-muted-foreground">
                    <tr>
                      <th className="p-2 cursor-pointer font-normal">Dátum</th>
                      <th className="p-2 cursor-pointer font-normal">Órarendi nap</th>
                      <th className="p-2 cursor-pointer font-normal">Művelet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearSchedule.plusDates.map((plusDate: any) => (
                      <tr key={plusDate.id} className="text-center border-t">
                        <td className="p-1">{new Date(plusDate.date).toLocaleDateString("hu-HU")}</td>
                        <td className="p-1">{days.find((day) => day.value === plusDate.replaceDay)?.label || plusDate.replaceDay}</td>
                        <td className="p-1">


                          <AlertDialog>
                            <AlertDialogTrigger>
                              <Button variant="ghost" data-testid="delete-button">
                                <Trash2 className="w-4 h-4 inline-block" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Biztosan törölni szeretné ezt a napot?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Ez a művelet nem vonható vissza. A szombati tanítási nap véglegesen törlésre kerül, és az adatai eltávolításra kerülnek a rendszerből.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Mégse</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePlusBreak(plusDate.id)}>Véglegesítés</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* <Button variant="ghost" onClick={() => handleDeletePlusBreak(plusDate.id)}>
                              <Trash2 className="w-4 h-4 inline-block" />
                            </Button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center p-3 text-muted-foreground">
                  Nincs megjelenítendő szombati tanítási nap
                </div>
              )}
            </div>
          </div>

          {/* </div> */}



          <Separator />
          <div className="mt-5 mb-5 flex flex-col gap-3 sm:gap-3">
            <div className="flex justify-between items-start">
              <div className="w-full sm:w-1/2">
                <h2 className="text-lg font-semibold">Tanítási szünetek</h2>
                <p className="text-sm text-muted-foreground">Az iskola tanítási szünetei és időtartamuk.</p>
              </div>


              <div >

                <Dialog open={isDialogOpen} onOpenChange={(isOpen) => setIsDialogOpen(isOpen)}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <CalendarPlus className="w-4 h-4 inline-block" /> Új szünet hozzáadás
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px]"

                  >
                    <DialogHeader>
                      <DialogTitle>Szünet hozzáadása</DialogTitle>
                      {/* <DialogDescription>
                        Aliquam metus eros, tristique nec semper id, congue eget metus
                      </DialogDescription> */}
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
                                    {format(date.from, "PPP", { locale: hu })} -{" "}
                                    {format(date.to, "PPP", { locale: hu })}
                                  </>
                                ) : (
                                  format(date.from, "PPP", { locale: hu })
                                )
                              ) : (
                                <span>2025. április 14. - 2025. május 20.</span>
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
                      <Button className="w-full" onClick={handleAddBreak}>Mentés</Button>

                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>
            </div>

            <div className="rounded-xl border overflow-x-auto w-full">
              {yearSchedule?.breakDates?.filter((breakPeriod: any) => breakPeriod.type === "szunet").length > 0 ? (
                <table className="min-w-full table-auto">
                  <thead className="text-center text-sm text-muted-foreground">
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
                          <td className="p-1">
                            {new Date(breakPeriod.start).toLocaleDateString("hu-HU")} - {new Date(breakPeriod.end).toLocaleDateString("hu-HU")}
                          </td>

                          <td className="p-1">
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <Button variant="ghost" data-testid="delete-button">
                                  <Trash2 className="w-4 h-4 inline-block" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Biztosan törölni szeretné ezt a szünetet</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Ez a művelet nem vonható vissza. A szünet véglegesen törlésre kerül, és az adatai eltávolításra kerülnek a rendszerből.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Mégse</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeletePlusBreak(breakPeriod.id)}>Véglegesítés</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            {/* <Button variant="ghost" onClick={() => handleDeletePlusBreak(breakPeriod.id)}>
                                <Trash2 className="w-4 h-4 inline-block" />
                              </Button> */}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center p-3 text-muted-foreground">Nincs megjelenítendő tanítási szünet</div>

              )}
            </div>

          </div>


        </div >
      </SidebarInset>
    </SidebarProvider>
  );
}


