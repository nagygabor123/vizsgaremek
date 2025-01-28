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

  // Ellenőrizzük a localStorage-t a komponens betöltésekor
  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  // Gomb kattintás kezelése
  const handleButtonClick = () => {
    setOverlayVisible(true);
  };

  // Form adatváltoztatás kezelése
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Tovább gomb kezelése
  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  // Vissza gomb kezelése
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // Form beküldés kezelése
  const handleFormSubmit = () => {
    console.log("Form Data:", formData);
    setOverlayVisible(false); // Felugró ablak eltüntetése
    setButtonVisible(false); // "Mutasd az ablakot" gomb eltüntetése
    localStorage.setItem("hasClickedOverlayButton", "true");
    window.location.reload();
  };

  // Bezárás gomb kezelése
  const handleClose = () => {
    setOverlayVisible(false); // Felugró ablak eltüntetése
  };

  // Addig ne rendereljük a gombot, amíg nem töltöttük be az adatot
  if (isButtonVisible === null) {
    return null; // Várakozás a localStorage betöltésére
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

            <div className="aspect-[3/1] rounded-xl bg-muted/50 flex items-center justify-center w-full overflow-hidden">
              <p className="text-center text-lg font-bold text-gray-800">
                Vegyes
              </p>
            </div>

            {isOverlayVisible && (
         <button
         onClick={handleButtonClick}
         className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
       >
         Mutasd az ablakot
       </button>
     )}

{isOverlayVisible && (
      <div className="fixed inset-0 bg-white z-50 grid grid-cols-2">
      {/* Left Side */}
      <div className="flex flex-col justify-between p-8 border-r border-gray-300">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2 relative mb-6">
          <div
            className="bg-blue-500 h-2 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>

        {/* Form Content */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Step {step} / 5</h3>
          <div className="w-full max-w-md">
            {step === 1 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your name"
                />
              </div>
            )}

            {step === 2 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {/* Add similar sections for steps 3, 4, and 5 */}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end w-full max-w-md mt-6 space-x-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleFormSubmit}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Submit
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute bottom-4 left-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Bezárás
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center">
        <div className="w-3/4 h-3/4 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Image placeholder</p>
        </div>
      </div>
    </div>
      )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
