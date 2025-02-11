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
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

import { ChevronRight, ChevronLeft } from "lucide-react"

export default function Page() {

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
    <div className="relative flex flex-col items-center justify-center p-8 shadow-md h-full sm:h-auto">
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
            <div
   style={{
    border: '2px dashed #000',
    borderRadius: '5px',
    padding: '20px',
    cursor: 'pointer',
    marginBottom: '10px',
    minHeight: '150px',
    display: 'flex',    
    justifyContent: 'center', 
    alignItems: 'center', 
        }}
      >
        { 'Húzzon ide egy csv fájlt, vagy kattintson a kiválasztáshoz'}
      </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} // Elrejtjük a fájl inputot
      />

<Button variant="outline">Fájl feltöltése</Button>
          </div>
        )}
        {step === 2 && (
            <div className="mb-6">
            <label className="block text-3xl font-bold">Órarend</label>
            <p className="text-base text-gray-500 mb-2">Aliquam porta condimentum ultrices. Morbi commodo posuere venenatis. In in egestas diam. Quisque mattis lectus id velit scelerisque ornare. </p>
            <div
        style={{
          border: '2px dashed #000',
          borderRadius: '5px',
          padding: '20px',
          cursor: 'pointer',
          marginBottom: '10px',
          minHeight: '150px',
          display: 'flex',    
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
      >
        { 'Húzzon ide egy csv fájlt, vagy kattintson a kiválasztáshoz'}
      </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} // Elrejtjük a fájl inputot
      />

<Button variant="outline">Fájl feltöltése</Button>
          </div>
        )}
         {step === 3 && (
            <div className="mb-6">
            <label className="block text-3xl font-bold">Tanulók</label>
            <p className="text-base text-gray-500 mb-2">Aliquam porta condimentum ultrices. Morbi commodo posuere venenatis. In in egestas diam. </p>
            <div
        style={{
          border: '2px dashed #000',
          borderRadius: '5px',
          padding: '20px',
          cursor: 'pointer',
          marginBottom: '10px',
          minHeight: '150px',
          display: 'flex',    
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
      >
        { 'Húzzon ide egy csv fájlt, vagy kattintson a kiválasztáshoz'}
      </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} // Elrejtjük a fájl inputot
      />

<Button variant="outline">Fájl feltöltése</Button>
          </div>
        )}
         {step === 4 && (
            <div className="mb-6">
            <label className="block text-3xl font-bold">Alkalmazottak</label>
            <p className="text-base text-gray-500 mb-2">Maecenas quis dignissim diam, eu commodo augue. Vestibulum fringilla est vitae gravida tincidunt. Etiam arcu lorem, iaculis in bibendum et, condimentum eget dolor.</p>
            <div
        style={{
          border: '2px dashed #000',
          borderRadius: '5px',
          padding: '20px',
          cursor: 'pointer',
          marginBottom: '10px',
          minHeight: '150px',
          display: 'flex',    
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
      >
        { 'Húzzon ide egy csv fájlt, vagy kattintson a kiválasztáshoz'}
      </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} // Elrejtjük a fájl inputot
      />
<Button variant="outline">Fájl feltöltése</Button>

          </div>
        )}
         {step === 5 && (
            <div className="mb-6">
            <label className="block text-3xl font-bold">Tanév rendje</label>
            <p className="text-base text-gray-500 mb-2">Nulla laoreet maximus placerat. Duis pellentesque maximus consequat. </p>
            <div
        style={{
          border: '2px dashed #000',
          borderRadius: '5px',
          padding: '20px',
          cursor: 'pointer',
          marginBottom: '10px',
          minHeight: '150px',
          display: 'flex',    
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
      >
        { 'Húzzon ide egy csv fájlt, vagy kattintson a kiválasztáshoz'}
      </div>
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} // Elrejtjük a fájl inputot
      />

<Button variant="outline">Fájl feltöltése</Button>
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

         
         mindenes / data table

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
