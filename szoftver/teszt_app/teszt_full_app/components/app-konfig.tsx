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
                  Beállítás
                </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
        {/* <button
                      onClick={() => setOverlayVisible(false)}
                      className="px-4 py-2 text-black bg-white rounded hover:bg-gray-200"
                    >
                      Bezárás
                    </button> */}
                    <button
                      onClick={handleConfirmClick}
                      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Megerősítés
                    </button>
      </SheetContent>
    </Sheet>
  );
};

export default SheetComponent;
