'use client';

import { useState } from 'react';

export default function XmlUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Ellenőrizni, hogy a fájl .xml típusú-e
      if (selectedFile.type !== 'text/xml' && !selectedFile.name.endsWith('.xml')) {
        setMessage('A feltöltött fájl nem .xml formátumú');
        setFile(null);
      } else {
        setFile(selectedFile);
        setMessage('Fájl kiválasztva: ' + selectedFile.name);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Nincs kiválasztva fájl');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
  
      const response = await fetch('https://vizsgaremek-mocha.vercel.app/api/setup/ascToDatabase', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Szerver hiba: ${response.status} - ${errorText}`);
      }
  
      const responseData = await response.json();
      console.log('Szerver válasz:', responseData);
      setMessage(`Szerver válasz: ${JSON.stringify(responseData.message)}`);
      return responseData;
    } catch (error) {
      console.error('Hiba a fájl feltöltése során:', error);

      // Típusellenőrzés vagy típuskonverzió
      if (error instanceof Error) {
        setMessage(`Hiba történt: ${error.message}`);
      } else {
        setMessage(`Hiba történt: ${String(error)}`);
      }
      throw error;
    }
  };

  return (
    <div>
      <h1>XML Feltöltés Teszt</h1>
      <input type="file" accept=".xml" onChange={handleFileChange} />
      <button onClick={handleUpload}>Feltöltés</button>
      <p>{message}</p>
    </div>
  );
}