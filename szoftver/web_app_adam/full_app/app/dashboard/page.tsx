"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
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
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
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
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden w-full">
          <div className="grid auto-rows-min gap-4 w-full">
            {/* Warning Message */}
            <div className="aspect-[17/1] rounded-xl bg-yellow-50 flex items-center justify-between px-4 w-full box-border overflow-hidden">
              <p className="text-sm font-semibold text-gray-800 truncate">
                Ez egy figyelmeztető üzenet. Kérjük, figyelmesen olvassa el!
              </p>
              <button className="px-3 py-1 text-sm font-semibold text-yellow-900 bg-yellow-300 rounded hover:bg-yellow-400">
                Akció
              </button>
            </div>

            {/* Nagy széles elem */}
            <div className="aspect-[2/1] rounded-xl bg-muted/50 flex items-center justify-center w-full overflow-hidden">
              <p className="text-center text-lg font-bold text-gray-800">
                Ez egy nagy széles elem tartalma.
              </p>
            </div>

            {/* Gomb csak akkor jelenik meg, ha az isButtonVisible true */}
            {isButtonVisible && (
              <button
                onClick={handleButtonClick}
                className="px-4 py-2 text-black bg-blue-500 rounded hover:bg-blue-600"
              >
                Mutasd az ablakot
              </button>
            )}

            {isOverlayVisible && (
              <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                {/* Bal felső sarokban szöveg */}
                <div className="absolute top-4 left-4 text-white text-lg font-semibold">
                  Ez egy bal felső sarokban lévő szöveg
                </div>

                {/* Középen tartalom */}
                <div className="text-center text-black">
                  <p className="mb-6 text-2xl font-bold">Ez egy teljes képernyős felugró ablak!</p>
                  <button
                    onClick={() => setOverlayVisible(false)}
                    className="px-4 py-2 text-black bg-white rounded hover:bg-gray-200"
                  >
                    Bezárás
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
