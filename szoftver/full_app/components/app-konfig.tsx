"use client";


import { useState, useEffect, useRef } from "react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { Button } from "@/components/ui/button";


  import {
    Paperclip
} from "lucide-react"




 

const SheetComponent: React.FC = () => {


    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
        const [file, setFile] = useState<File | null>(null);
    // const [message, setMessage] = useState<string>('');
    const [message, setMessage] = useState<React.ReactNode>("");

    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [apiResponse, setApiResponse] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
  
      if (droppedFile.type !== 'text/xml' && !droppedFile.name.endsWith('.xml')) {
        setMessage('A feltöltött fájl nem .xml formátumú');
        setFile(null);
      } else {
        setSelectedFile(droppedFile);
        setFile(droppedFile); // Ezt kell hozzáadni
        setMessage(
          <span>
            <Paperclip className="w-4 h-4 inline-block" /> {droppedFile.name}
          </span>
        );
      }
    }
  };
  

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
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
  



  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        // Ellenőrizni, hogy a fájl .xml típusú-e
        if (selectedFile.type !== 'text/xml' && !selectedFile.name.endsWith('.xml')) {
          setMessage('A feltöltött fájl nem .xml formátumú');
          setFile(null);
        } else {
          setFile(selectedFile);
          // setMessage('Fájl kiválasztva: ' + selectedFile.name);
          setMessage(
            <span>
              <Paperclip className="w-4 h-4 inline-block" /> {selectedFile.name}
            </span>
          );
          
        }
      }
    };
  
    const handleUpload = async () => {
      if (!file) {
        setMessage('Nincs kiválasztva fájl');
        return;
      }
  
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('http://localhost:3000/api/setup/ascToDatabase', {
          method: 'POST',
          body: formData,
        });
  
        const result = await response.json();
  
        if (result.error) {
          // Ha hiba történt, akkor azt is megjelenítjük
          setMessage('Hiba: ' + result.error);
        } else {
          setMessage(result.message || 'Sikeres feltöltés');
        }
  
        console.log('Feltöltési válasz:', result);
      } catch (error) {
        setMessage('Hiba történt a feltöltés során');
        console.error('Hiba:', error);
      }
  
      console.log('Fájl:', file);
    };
  



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
          
         
    {/* <div className="mt-5 border-dashed border-2 border-blue-400 rounded-md p-4 flex flex-col items-center justify-center min-h-[250px] cursor-pointer hover:bg-zinc-50 transition text-center">
      <img
        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsb3VkLXVwbG9hZCI+PHBhdGggZD0iTTEyIDEzdjgiLz48cGF0aCBkPSJNNCAxNC44OTlBNyA3IDAgMSAxIDE1LjcxIDhoMS43OWE0LjUgNC41IDAgMCAxIDIuNSA4LjI0MiIvPjxwYXRoIGQ9Im04IDE3IDQtNCA0IDQiLz48L3N2Zz4="
        alt="Upload Icon"
        className="w-12 h-12 opacity-75 mx-auto"
      />
      <p className="text-zinc-700 font-semibold mt-3">Válassza ki a feltölteni kívánt CSV-fájlt</p>
      <p className="text-sm text-gray-500">vagy húzza ide a fájlt</p>
     
    </div>

      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }} 
      /> */}




{/* <h1>Konfigurációs felület</h1>
      <p>Diák hozzáadása:</p> */}
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
        {selectedFile ? selectedFile.name :  <p className="text-sm text-gray-500">vagy húzza ide a fájlt</p>}
      </div>
      <input
        type="file"
        accept=".xml"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />


{message && (
        <p> 
        {/* , color: message.startsWith('Error') ? 'red' : 'green' */}
         {message}
         {/* <Paperclip className="w-4 h-4 inline-block" />  */}
        </p>
      )}



      <Button onClick={handleUpload}>
        Feltöltés
      </Button>
  
      {/* {apiResponse && (
        <pre style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px' }}>
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )} */}



    {/* </div> */}




{/* <div>
      <h1>XML Feltöltés Teszt</h1>
      <input type="file" accept=".xml" onChange={handleFileChange} />
      <button onClick={handleUpload}>Feltöltés</button>
      <p>{message}</p>
    </div> */}

















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
