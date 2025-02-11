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

export default function Page() {

  

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [breaks, setBreaks] = useState<string[]>([]);
  const [saturdayClasses, setSaturdayClasses] = useState<string[]>([]);
  const [nonTeachingDays, setNonTeachingDays] = useState<string[]>([]);
  const [newBreak, setNewBreak] = useState<string>(""); 
  const [newSaturdayClass, setNewSaturdayClass] = useState<string>(""); 
  const [newNonTeachingDay, setNewNonTeachingDay] = useState<string>("");

  const handleAddDate = (date: string, setter: (dates: string[]) => void, dates: string[]) => {
    if (date && !dates.includes(date)) {
      setter([...dates, date]);
    }
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

  // Állapotok a dátumok és a szünetekhez


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
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden w-full">
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
            className="bg-neutral-950 h-3 transition-all duration-300"
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
    <div className="mt-5 border-dashed border-2 border-zinc-300 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
        alt="Upload Icon"
        className="w-12 h-12 opacity-75 mx-auto"
      />
      <p className="text-gray-700 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p>
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
    <p className="text-base text-gray-500 mb-2">Nulla laoreet maximus placerat. Duis pellentesque maximus consequat. </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
      <div>
        <h2 className="mt-2">A tanítási év első napja</h2>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        {startDate && <p>Kiválasztott dátum: {startDate}</p>}
      </div>

      <div>
        <h2 className="mt-2">A tanítási év utolsó napja</h2>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
          />
       
        </div>
        {endDate && <p>Kiválasztott dátum: {endDate}</p>}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

      <div>
        <h2 className="">Szombati tanítási napok</h2>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={newSaturdayClass}
            onChange={(e) => setNewSaturdayClass(e.target.value)}
          />
          <Button onClick={() => handleAddDate(newSaturdayClass, setSaturdayClasses, saturdayClasses)} variant="outline" size="icon">
            <Plus />
          </Button>
        </div>
        <ul className="mt-2">
          {saturdayClasses.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="">Tanítás nélküli munkanapok</h2>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={newNonTeachingDay}
            onChange={(e) => setNewNonTeachingDay(e.target.value)}
          />
          <Button onClick={() => handleAddDate(newNonTeachingDay, setNonTeachingDays, nonTeachingDays)} variant="outline" size="icon">
            <Plus />
          </Button>
        </div>
        <ul className="mt-2">
          {nonTeachingDays.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      </div>
    </div>

    <div>
        <h2 className="">Szünetek rendje</h2>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={newBreak}
            onChange={(e) => setNewBreak(e.target.value)}
          />
          <Button onClick={() => handleAddDate(newBreak, setBreaks, breaks)} variant="outline" size="icon">
            <Plus />
          </Button>
        </div>
        <ul className="mt-2">
          {breaks.map((date, index) => (
            <li key={index}>{date}</li>
          ))}
        </ul>
      </div>

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

         
          <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Iskola Beállítások</h1>

      {/* Módosítás gomb */}
      <div className="mb-4">
        <button
          
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          { 'Módosítás mentése'}
        </button>
      </div>

      {/* Tanév kezdete és vége */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Tanév kezdet és befejezés</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
             
            
            />
            <input
              type="date"
             
            />
          </div>
        </div>
      </div>

      {/* Szünetek */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Iskolai Szünetek</h2>
        <div className="flex gap-2">
          <input
            type="date"
           
            className="border p-2 rounded"
          />
         
            <button
             
              className="bg-green-500 text-white px-4 rounded"
            >
              Új szünet hozzáadása
            </button>
          
        </div>
        <ul>
         
            <li className="flex items-center gap-2">
          
              
                <button
                
                  className="text-red-500"
                >
                 
                </button>
              
            </li>
        
        </ul>
      </div>

      {/* Szombati tanítási napok */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Szombati Tanítási Napok</h2>
        <div className="flex gap-2">
          <input
            type="date"
           
            className="border p-2 rounded"
          />
         
            <button
            
              className="bg-green-500 text-white px-4 rounded"
            >
              Új nap hozzáadása
            </button>
         
        </div>
        <ul>
         
            <li  className="flex items-center gap-2">
              
           
                <button
                 
                  className="text-red-500"
                >
                 
                </button>
            
            </li>
        
        </ul>
      </div>

      {/* Tanítás nélküli munkanapok */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Tanítás Nélküli Munkanapok</h2>
        <div className="flex gap-2">
          <input
            type="date"
        
          
            className="border p-2 rounded"
          />
        
            <button
              
              className="bg-green-500 text-white px-4 rounded"
            >
              Új nap hozzáadása
            </button>
         
        </div>
        <ul>
         
            <li  className="flex items-center gap-2">
          
             
                <button
                
                  className="text-red-500"
                >
                
                </button>
             
            </li>
       
        </ul>
      </div>
    </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
