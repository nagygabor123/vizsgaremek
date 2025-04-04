
import { signOut, useSession } from "next-auth/react";
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
import { Paperclip, TriangleAlert } from "lucide-react";
import { Loader2 } from "lucide-react"

const SheetComponent: React.FC = () => {
  const { data: session } = useSession();
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<React.ReactNode>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvMessage, setCsvMessage] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = window.location.origin;

  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep");
    if (savedStep) {
      setStep(Number(savedStep));
    }

    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  const handleNext = async () => {
    setIsLoading(true);
    if (step === 1) {
      if (!file) {
        setMessage(
          <div className="text-red-600 text-sm">Nincs fájl kiválasztva</div>
        );
        setIsLoading(false);
        return;
      }

      await handleUpload();

      if (message && message !== "Sikeres feltöltés") {
        setStep((prev) => Math.min(prev + 1, 3));
        localStorage.setItem("currentStep", String(step + 1));
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(false);
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
          <div className="text-red-600 text-sm">
            A feltöltött fájl nem .xml formátumú
          </div>
        );
        setFile(null);
      } else {
        setSelectedFile(droppedFile);
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

  const handleConfirmClick = async () => {
    setIsLoading(true);
    if (csvFile) {
      await handleCsvUpload();
    }
    setButtonVisible(false);
    setIsSheetOpen(false);
    setIsLoading(false);
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

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setCsvFile(selectedFile);
      setCsvMessage(
        <span>
          <Paperclip className="w-4 h-4 inline-block text-sm" /> {selectedFile.name}
        </span>

      );
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      <div className="text-red-600 text-sm">Nincs fájl kiválasztva</div>
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/setup/studentsToDatabase?school_id=${session?.user?.school_id}`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setCsvMessage('File uploaded successfully!');
        localStorage.removeItem("currentStep");
      } else {
        setCsvMessage('Error occurred during file upload.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setCsvMessage(`Error: ${error.message}`);
      } else {
        setCsvMessage('An unknown error occurred.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage(
        <div className="text-red-600 text-sm">Nincs fájl kiválasztva</div>
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/setup/ascToDatabase?school_id=${session?.user?.school_id}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Szerver hiba: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      setMessage(result.message || "Sikeres feltöltés");
      console.log("Feltöltési válasz:", result);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Hiba történt: ${error.message}`);
      } else {
        setMessage("Hiba történt a feltöltés során");
      }
      console.error("Hiba:", error);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger data-testid="configure-button" asChild>
        <div className="flex flex-col gap-4 overflow-x-hidden w-full">
          <div className="grid auto-rows-min gap-4 w-full">
            {isButtonVisible && (
              <div className="min-h-[60px] rounded-xl bg-red-100 flex items-center px-4 w-full box-border overflow-hidden">
                <TriangleAlert className="text-red-600 hidden sm:block" />
                <p className="text-sm truncate ml-3 text-red-600">
                  A rendszer nincs beállítva. Kérjük, végezze el a szükséges konfigurációt!
                </p>
                <Button className="ml-auto" variant="destructive" onClick={() => setIsSheetOpen(true)}>
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
            Két lépésben végigvezetjük a konfiguráláson.
          </SheetDescription>
        </SheetHeader>

        <div className="flex justify-center space-x-4 my-4">
          <span className={step === 1 ? "font-bold" : "text-muted-foreground"}>
            1. ASC órarend feltöltése
          </span>
          <span className={step === 2 ? "font-bold" : "text-muted-foreground"}>
            2. Diákok feltöltése
          </span>
        </div>

        {step === 1 && (
          <div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
              className="mt-5 border-dashed border-2 border-blue-600 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-blue-100 transition text-center"
            >
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
                alt="Upload Icon"
                className="w-12 h-12 mx-auto"
              />
              {/* {selectedFile ? selectedFile.name :  }*/}
              <p className="text-gray-950 font-semibold mt-3">Válassza ki a feltölteni kívánt XML-fájlt</p>
              {/* {selectedFile ? selectedFile.name : <p className="text-am text-muted-foreground">vagy húzza ide a fájlt</p>} */}
              {message && <p className="mt-5">{message}</p>}
            </div>
            <input
              type="file"
              accept=".xml"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              data-testid="file-input"
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => csvFileInputRef.current?.click()}
              className="mt-5 border-dashed border-2 border-blue-600 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-blue-100 transition text-center"
            >
              <img
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
                alt="Upload Icon"
                className="w-12 h-12 mx-auto"
              />
              {/*  {csvFile ? csvFile.name :  }*/}
              <p className="text-gray-900 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p>
              {/* {csvFile ? csvFile.name : <p className="text-base text-gray-500">vagy húzza ide a fájlt</p>} */}
              {csvMessage && <p className="mt-5">{csvMessage}</p>}
            </div>
            <input
              type="file"
              accept=".csv"
              ref={csvFileInputRef}
              onChange={handleCsvFileChange}
              style={{ display: "none" }}
              data-testid="csv-input"
            />
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            onClick={step < 2 ? handleNext : handleConfirmClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kérjük, várjon...
              </>
            ) : (
              step < 2 ? "Mentés & Tovább" : "Mentés & Megerősítés"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SheetComponent;