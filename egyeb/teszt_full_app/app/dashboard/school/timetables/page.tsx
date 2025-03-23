"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
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

  // Ellenőrizzük a localStorage-t a komponens betöltésekor
  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  // Gomb kattintás kezelése
  const handleButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleConfirmClick = () => {
    setOverlayVisible(false);
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
    window.location.reload();
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
      <BreadcrumbPage>Adminisztráció</BreadcrumbPage>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Órarendek</BreadcrumbPage>
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
              <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                <div className="absolute top-4 left-4 text-white text-lg font-semibold">
                  Ez egy bal felső sarokban lévő szöveg
                </div>
                <div className="text-center text-black">
                  <p className="mb-6 text-2xl font-bold">
                    Ez egy teljes képernyős felugró ablak!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setOverlayVisible(false)}
                      className="px-4 py-2 text-black bg-white rounded hover:bg-gray-200"
                    >
                      Bezárás
                    </button>
                    <button
                      onClick={handleConfirmClick}
                      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Megerősítés
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>


órarend

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
