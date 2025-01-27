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

            <div className="aspect-[1/1] rounded-xl bg-muted/50 flex items-center justify-center w-full overflow-hidden">
              <p className="text-center text-lg font-bold text-gray-800">
                Vegyes
              </p>
            </div>

            {isOverlayVisible && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          {/*  
          <div className="absolute top-4 left-4 text-white text-lg font-semibold">
            Ez egy bal felső sarokban lévő szöveg
          </div> */}

          {/* Középen tartalom */}
          <div className="bg-white p-6 max-w-xl w-full">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Step {step} / 5</span>
                <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-blue-500 transition-all duration-300`}
                    style={{ width: `${(step / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 1: Personal Info</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 2: Additional Info</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your age"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your city"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 3: Professional Info</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Profession</label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your profession"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Hobby</label>
                  <input
                    type="text"
                    name="hobby"
                    value={formData.hobby}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter your hobby"
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 4: Experience</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Experience</label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Describe your experience"
                  />
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 5: Feedback</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Feedback</label>
                  <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Share your feedback"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Back
                </button>
              )}

              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFormSubmit}
                  className="ml-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Submit
                </button>
              )}
            </div>

            {/* Bezárás gomb */}
            <div className="mt-4 text-center">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Bezárás
              </button>
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
