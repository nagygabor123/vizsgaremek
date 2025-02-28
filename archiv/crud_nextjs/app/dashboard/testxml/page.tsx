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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/test/ascToDatabase', {
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
    <div>
      <h1>XML Feltöltés Teszt</h1>
      <input type="file" accept=".xml" onChange={handleFileChange} />
      <button onClick={handleUpload}>Feltöltés</button>
      <p>{message}</p>
    </div>
  );
}
