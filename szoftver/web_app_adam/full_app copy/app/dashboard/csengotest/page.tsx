'use client';

import { useState } from 'react';

export default function CsvUploadTest() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
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
      const response = await fetch('/api/config/addRinging', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setMessage(result.message || 'Sikeres feltöltés');
    } catch (error) {
      setMessage('Hiba történt a feltöltés során');
    }
  };

  return (
    <div>
      <h1>CSV Feltöltés Teszt</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Feltöltés</button>
      <p>{message}</p>
    </div>
  );
}