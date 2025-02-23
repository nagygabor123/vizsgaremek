"use client";


import { useState, useEffect } from "react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { Button } from "@/components/ui/button";

const SheetComponent: React.FC = () => {
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
    <Sheet>
      <SheetTrigger asChild>
      <Button
                 onClick={handleButtonClick}
                  className="ml-auto"
                  variant="link"
                >
                  Konfigurálás most
                </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Are you absolutely sure?</SheetTitle>
          <SheetDescription >
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        {/* <button
                      onClick={() => setOverlayVisible(false)}
                      className="px-4 py-2 text-black bg-white rounded hover:bg-gray-200"
                    >
                      Bezárás
                    </button> */}
                          <div className="mb-6">
          
         
    <div className="mt-5 border-dashed border-2 border-blue-400 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
        alt="Upload Icon"
        className="w-12 h-12 opacity-75 mx-auto"
      />
      <p className="text-zinc-700 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p>
      <p className="text-sm text-gray-500">vagy húzza ide a fájlt</p>
      
      {/* <Button className="mt-3" variant="link">(Kiválaszott fál feltöltése)</Button> */}
    </div>

      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} 
      />

          </div>
          <div  className="text-right"><Button
                
                      onClick={handleConfirmClick}
                      
                    >
                      Megerősítés
                    </Button></div>
                    
      </SheetContent>
    </Sheet>
  );
};

export default SheetComponent;
