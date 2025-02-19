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
import { TriangleAlert, Plus } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ChevronRight, ChevronLeft } from "lucide-react"

import * as React from "react"
import { format } from "date-fns"
import { addDays } from 'date-fns';

import { CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
 
import { DateRange } from 'react-day-picker';








export default function Page() {
  const [message, setMessage] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [yearSchedule, setYearSchedule] = useState<any>({
    plusDates: [],
    breakDates: [],
    schoolStart: '',
    schoolEnd: ''
  });
  const [schoolStartEdit, setSchoolStartEdit] = useState('');
  const [schoolEndEdit, setSchoolEndEdit] = useState('');
  const [newBreak, setNewBreak] = useState({ nev: '', which_day: '', replace_day: '' });
  const [newPlusDate, setNewPlusDate] = useState({  nev: '', which_day: '', replace_day: '' });
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
      const startRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=kezd');
      const endRes = await fetch('http://localhost:3000/api/config/getYearSchedule?type=veg');

      const plusDates = await plusRes.json();
      const breakDates = await szunetRes.json();
      const schoolStart = await startRes.json();
      const schoolEnd = await endRes.json();

      setYearSchedule({
        plusDates: plusDates.plusDates_alap,
        breakDates: breakDates.breakDates_alap,
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
          breakDates: [...prev.breakDates, newBreak]
        }));
        setNewBreak({ nev: '', which_day: '', replace_day: '' });
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
        setYearSchedule((prev: typeof yearSchedule) => ({
          ...prev,
          plusDates: [...prev.plusDates, newPlusDate]
        }));
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
          breakDates: prev.breakDates.filter((breakPeriod: any) => breakPeriod.id !== id),
          plusDates: prev.plusDates.filter((plusDate: any) => plusDate.id !== id),
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
  const [date, setDate] = React.useState<Date>()
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
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
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
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Rendszer</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tanév beállításai</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
          <div className="grid auto-rows-min gap-4 w-full">
            {isButtonVisible && (
              <div className="aspect-[17/1] rounded-xl bg-yellow-50 flex items-center px-4 w-full box-border overflow-hidden">
                <TriangleAlert className="text-amber-400" />
                <p className="text-sm truncate ml-3">
                  Ez egy figyelmeztető üzenet. Kérjük, figyelmesen olvassa el!
                </p>
                <Button
                  onClick={handleButtonClick}
                  className="ml-auto"
                  variant="link"
                >
                  Beállítás
                </Button>
              </div>
            )}

{isOverlayVisible && (
  <div className="fixed inset-0 bg-white z-50 flex flex-col sm:grid sm:grid-cols-2">
    <div className="relative flex flex-col items-center justify-center p-12 shadow-md h-full sm:h-auto">
      <div className="w-1/2 mb-6 self-start fixed top-0 left-0 right-1/2 px-0">
        <div className="bg-white h-3">
          <div
            className="bg-blue-500 h-3 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="w-full relative mt-8">
        <span className="absolute top-0 right-0 text-sm text-gray-500">{step} / 5</span>
        {step === 1 && (
          <div className="mb-6">
            <label className="block text-3xl font-bold">Csengetési rend</label>
            <p className="text-base text-gray-500 mb-2">Nullam mattis sodales sem quis tincidunt. </p>
    <div className="mt-5 border-dashed border-2 border-blue-400 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
        alt="Upload Icon"
        className="w-12 h-12 opacity-75 mx-auto"
      />
      <p className="text-zinc-700 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p>
      <p className="text-sm text-gray-500">vagy húzza ide a fájlt</p>
      
      <Button className="mt-3" variant="link">(Kiválaszott fál feltöltése)</Button>
    </div>

      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} 
      />

          </div>
        )}
        {step === 2 && (
            <div className="mb-6">
            <label className="block text-3xl font-bold">Órarend</label>
            <p className="text-base text-gray-500 mb-2">Aliquam porta condimentum ultrices. Morbi commodo posuere venenatis. In in egestas diam. Quisque mattis lectus id velit scelerisque ornare. </p>
            <div className="mt-5 border-dashed border-2 border-zinc-300 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
        alt="Upload Icon"
        className="w-12 h-12 opacity-75 mx-auto"
      />
      <p className="text-gray-700 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p>
      <p className="text-sm text-gray-500">vagy húzza ide a fájlt</p>
    </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} // Elrejtjük a fájl inputot
      />

          </div>
        )}
         {step === 3 && (
            <div className="mb-6">
            <label className="block text-3xl font-bold">Tanulók</label>
            <p className="text-base text-gray-500 mb-2">Aliquam porta condimentum ultrices. Morbi commodo posuere venenatis. In in egestas diam. </p>
            <div className="mt-5 border-dashed border-2 border-zinc-300 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
        alt="Upload Icon"
        className="w-12 h-12 opacity-75 mx-auto"
      />
      <p className="text-gray-700 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p>
      <p className="text-sm text-gray-500">vagy húzza ide a fájlt</p>
    </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} // Elrejtjük a fájl inputot
      />

          </div>
        )}
         {step === 4 && (
            <div className="mb-6">
            <label className="block text-3xl font-bold">Alkalmazottak</label>
            <p className="text-base text-gray-500 mb-2">Maecenas quis dignissim diam, eu commodo augue. Vestibulum fringilla est vitae gravida tincidunt. Etiam arcu lorem, iaculis in bibendum et, condimentum eget dolor.</p>
            <div className="mt-5 border-dashed border-2 border-zinc-300 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
        alt="Upload Icon"
        className="w-12 h-12 opacity-75 mx-auto"
      />
      <p className="text-gray-700 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p>
      <p className="text-sm text-gray-500">vagy húzza ide a fájlt</p>
    </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} // Elrejtjük a fájl inputot
      />

          </div>
        )}
{step === 5 && (
  <div className="mb-6">
    <label className="block text-3xl font-bold">Tanév rendje</label>
    <p className="text-base text-gray-500 mb-2">Nulla laoreet maximus placerat. Duis pellentesque maximus consequat.</p>

    <div className="">
  {/* First Section */}
  <div className="">
    <Label htmlFor="email">A tanítási év első napja </Label> {/*{startDate && format(startDate, "PPP")} */}
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !startDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {startDate ? format(startDate, "PPP") : <span>Válasszon egy napot</span>}
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
  </div>

  {/* Second Section */}
  <div className="">
    <Label htmlFor="email">A tanítási év utolsó napja </Label> {/*{endDate && format(endDate, "PPP")} */}
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !endDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {endDate ? format(endDate, "PPP") : <span>Válasszon egy napot</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={endDate}
          onSelect={setEndDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  </div>
</div>

    




    

     
      <Label htmlFor="email">Tanítás nélküli munkanapok</Label>
      <div className="space-x-2">  
                <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !newNonTeachingDay && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {newNonTeachingDay ? format(newNonTeachingDay, "PPP") : <span>Válasszon egy dátumot</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={newNonTeachingDay}
              onSelect={setNewNonTeachingDay}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => handleAddDate(newNonTeachingDay, setNonTeachingDays, nonTeachingDays)} variant="outline">
          <Plus />
        </Button>
        <ul className="mt-2">
          {nonTeachingDays.map((date, index) => (
            <li key={index}>{format(date, "PPP")}</li>
          ))}
        </ul>
  
      
   </div>

 
   
      
      <Label htmlFor="email">Szombati tanítási napok</Label>
        
      <div >
      <Input type="email" placeholder="Tanítási nap" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !newSaturdayClass && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {newSaturdayClass ? format(newSaturdayClass, "PPP") : <span>Válasszon egy dátumot</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={newSaturdayClass}
              onSelect={setNewSaturdayClass}
              initialFocus
            />
          </PopoverContent>
        </Popover>
       
        <Button onClick={() => handleAddDate(newSaturdayClass, setSaturdayClasses, saturdayClasses)} variant="outline">
          <Plus />
        </Button>
    
        </div>
        <ul className="mt-2">
          {saturdayClasses.map((date, index) => (
            <li key={index}>{format(date, "PPP")}</li>
          ))}
        </ul>

   
  
        <Label htmlFor="email">Tanítási szünetek</Label>
        <div >
      <Input type="email" placeholder="Szünet neve" />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Válasszon egy dátumtartományt</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <Button
  onClick={() => {
    if (dateRange?.from && dateRange?.to) {
      setBreaks(prev => [
        ...prev,
        { from: dateRange.from as Date, to: dateRange.to as Date }
      ]);
    }
  }}
  variant="outline"
 
>
  <Plus />
</Button>
    </div>
    


      {/* List of breaks */}
      <ul className="mt-2">
        {breaks.map((range, index) => (
          <li key={index}>
            {format(range.from, "PPP")} - {format(range.to, "PPP")}
          </li>
        ))}
      </ul>
  
  </div>
)}


      </div>

      <div className="flex justify-end w-full mt-6 space-x-4">
        {step > 1 && (
          <Button onClick={handleBack} className="px-6 py-3" variant="outline" size="icon">
            <ChevronLeft />
          </Button>
        )}
        {step < 5 ? (
          <Button onClick={handleNext} className="px-6 py-3 " variant="outline" size="icon">
            <ChevronRight />
          </Button>
        ) : (
          <Button onClick={handleFormSubmit} className="px-6 py-3">
            Kész
          </Button>
        )}
      </div>
    </div>

    <Button
      onClick={handleClose}
      className="absolute bottom-4 left-4 px-4 py-2"
      variant="link"
    >
      Mentés & bezárás
    </Button>

    {/* Right Side (csak desktop nézetben) */}
    <div className="hidden sm:flex items-center justify-center bg-neutral-50">
      {/* <div className="w-3/4 h-3/4 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Képes helyőrző</p>
      </div> */}
    </div>
  </div>
)}

         
          </div>

        

        </div>



        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {message && (
        <p style={{ marginTop: '20px', color: message.startsWith('Error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
      {apiResponse && (
        <pre style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px' }}>
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )}
      <h2>Tanév beállítása</h2>

      <label>Tanév kezdete:</label>
      <input
        type="date"
        value={schoolStartEdit}
        onChange={(e) => setSchoolStartEdit(e.target.value)}
      />
      <button onClick={() => updateSchoolYear('kezd', schoolStartEdit)}>Mentés</button>

      <br></br> 

      <label>Tanév vége:</label>
      <input
        type="date"
        value={schoolEndEdit}
        onChange={(e) => setSchoolEndEdit(e.target.value)}
      />
      <button onClick={() => updateSchoolYear('veg', schoolEndEdit)}>Mentés</button>
      
      <h3>Szünetek</h3>
      {yearSchedule.breakDates.length > 0 ? (
        <ul>
          {yearSchedule.breakDates.map((breakPeriod: any, index: number) => (
            <li key={index}>
              {breakPeriod.id} {breakPeriod.name}: {breakPeriod.start} - {breakPeriod.end}     
              <button onClick={() => handleDeletePlusBreak(breakPeriod.id)}>Törlés</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nincsenek szünetek.</p>
      )}
      <input
        type="text"
        placeholder="Szünet neve"
        value={newBreak.nev}
        onChange={(e) => setNewBreak({ ...newBreak, nev: e.target.value })}
      />
      <input
        type="date"
        value={newBreak.which_day}
        onChange={(e) => setNewBreak({ ...newBreak, which_day: e.target.value })}
      />
      <input
        type="date"
        value={newBreak.replace_day}
        onChange={(e) => setNewBreak({ ...newBreak, replace_day: e.target.value })}
      />
      <button onClick={handleAddBreak}>Új szünet hozzáadása</button>

      <h3>Plusz napok</h3>
      {yearSchedule.plusDates.length > 0 ? (
        <ul>
          {yearSchedule.plusDates.map((plusDate: any, index: number) => (
            <li key={index}>
              {plusDate.id} {plusDate.name}: {plusDate.date} - {plusDate.replaceDay}
              <button onClick={() => handleDeletePlusBreak(plusDate.id)}>Törlés</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nincsenek plusz napok.</p>
      )}
      <input
        type="text"
        placeholder="Plusz nap neve"
        value={newPlusDate.nev}
        onChange={(e) => setNewPlusDate({ ...newPlusDate, nev: e.target.value })}
      />
      <input
        type="date"
        value={newPlusDate.which_day}
        onChange={(e) => setNewPlusDate({ ...newPlusDate, which_day: e.target.value })}
      />
      <select
        id="replace_day"
        value={newPlusDate.replace_day}
        onChange={(e) => setNewPlusDate({ ...newPlusDate, replace_day: e.target.value })}
      >
        {days.map((day) => (
          <option key={day.value} value={day.value}>
            {day.label}
          </option>
        ))}
      </select>
      <button onClick={handleAddPlusDate}>Új plusz nap hozzáadása</button>
    </div>


      </SidebarInset>
    </SidebarProvider>
  );
}


