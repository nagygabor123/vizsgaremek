import { useState, useEffect, useRef } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";


import { TriangleAlert } from "lucide-react"

const SheetComponent: React.FC = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<React.ReactNode>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    if (savedStep) {
      setStep(Number(savedStep));
    }

    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  const handleNext = async () => {
    if (step === 1) {
      if (!file) {
        setMessage(
          <div className="text-red-500 text-sm">Nincs fájl kiválasztva</div>
        );
        return;
      }

      await handleUpload();

      if (message && message !== "Sikeres feltöltés") {
        setStep((prev) => Math.min(prev + 1, 3));
        localStorage.setItem("currentStep", String(step + 1)); 
        return;
      }
    }
  };

  const handlePrev = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    localStorage.setItem("currentStep", String(step - 1)); 
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];

      if (droppedFile.type !== "text/xml" && !droppedFile.name.endsWith(".xml")) {
        setMessage(
          <div className="text-red-500 text-sm">
            A feltöltött fájl nem .xml formátumú
          </div>
        );
        setFile(null);
      } else {
        //setSelectedFile(droppedFile);
        setFile(droppedFile);
        setMessage(
          <div>
            <Paperclip className="w-4 h-4 inline-block text-sm" /> {droppedFile.name}
          </div>
        );
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };


  const handleButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleConfirmClick = () => {
    setOverlayVisible(false);
    setButtonVisible(false);
    //localStorage.setItem("hasClickedOverlayButton", "true");
    window.location.reload();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "text/xml" && !selectedFile.name.endsWith(".xml")) {
        setMessage(
          <div className="text-red-500 text-sm">
            A feltöltött fájl nem .xml formátumú
          </div>
        );
        setFile(null);
      } else {
        setFile(selectedFile);
        setMessage(
          <span>
            <Paperclip className="w-4 h-4 inline-block text-sm" /> {selectedFile.name}
          </span>
        );
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage(
        <div className="text-red-500 text-sm">Nincs fájl kiválasztva</div>
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/api/setup/ascToDatabase", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.error) {
        setMessage("Hiba: " + result.error);
      } else {
        setMessage(result.message || "Sikeres feltöltés");
      }

      console.log("Feltöltési válasz:", result);
    } catch (error) {
      setMessage("Hiba történt a feltöltés során");
      console.error("Hiba:", error);
    }

    console.log("Fájl:", file);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
      <div className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
            <div className="grid auto-rows-min gap-4 w-full">
            {isButtonVisible && ( 
              <div className="min-h-[60px] rounded-xl bg-red-100 flex items-center px-4 w-full box-border overflow-hidden">
                <TriangleAlert className="text-red-500" />
                <p className="text-sm truncate ml-3 text-red-500">
                A rendszer nincs beállítva. Kérjük, végezze el a szükséges konfigurációt!
                </p>
                <Button className="ml-auto" variant="destructive">
          Konfigurálás most
        </Button>
            
              </div>
            )} 
             
            </div>
          </div>
    
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Beállítási folyamat</SheetTitle>
          <SheetDescription>
            Három lépésben végigvezetjük a konfiguráláson.
          </SheetDescription>
        </SheetHeader>

        <div className="flex justify-center space-x-4 my-4">
          <span className={step === 1 ? "font-bold" : "text-gray-500"}>
            1. ASC órarend feltöltés
          </span>
          <span className={step === 2 ? "font-bold" : "text-gray-500"}>
            2. Diákok feltöltése
          </span>
        </div>

        {step === 1 && (
          <div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
              className="mt-5 border-dashed border-2 border-blue-400 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center"
            >
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
                alt="Upload Icon"
                className="w-12 h-12 opacity-75 mx-auto"
              />
              {selectedFile ? selectedFile.name : <p className="text-zinc-700 font-semibold mt-3">Válassza ki a feltölteni kívánt XML-fájlt</p>}
              {selectedFile ? selectedFile.name : <p className="text-base text-gray-500">vagy húzza ide a fájlt</p>}
              {message && <p className="mt-5">{message}</p>}
            </div>
            <input
              type="file"
              accept=".xml"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <div>
              <div
                //onDragOver={handleDragOver}
                //onDrop={handleDrop}
                //onClick={handleClick}
                className="mt-5 border-dashed border-2 border-blue-400 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center"
              >
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
                  alt="Upload Icon"
                  className="w-12 h-12 opacity-75 mx-auto"
                />
                {/* {selectedFile ? selectedFile.name :*/} <p className="text-zinc-700 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p> {/*}*/}
                {/*{selectedFile ? selectedFile.name :*/} <p className="text-base text-gray-500">vagy húzza ide a fájlt</p> {/*}*/}
                {/* {message && <p className="mt-5">{message}</p>}*/}
              </div>
              <input
                type="file"
                accept=".csv"
                //ref={fileInputRef}
                //onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6">
          {step < 2 ? (
            <Button onClick={handleNext}>Mentés & Tovább</Button>
          ) : (
            <Button onClick={handleConfirmClick}>Mentés & Megerősítés</Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetComponent;
