'use client';

import { useState, useRef, useEffect } from 'react';

const Configuration = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [yearSchedule, setYearSchedule] = useState<any>({
    plusDates: [],
    breakDates: [],
    schoolStart: '',
    schoolEnd: ''
  });
  const [schoolStartEdit, setSchoolStartEdit] = useState('');
  const [schoolEndEdit, setSchoolEndEdit] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchYearSchedule = async () => {
      try {
        const plusRes = await fetch('http://localhost:3000/api/config/handleYearSchedule?type=plusznap');
        const szunetRes = await fetch('http://localhost:3000/api/config/handleYearSchedule?type=szunet');
        const startRes = await fetch('http://localhost:3000/api/config/handleYearSchedule?type=kezd');
        const endRes = await fetch('http://localhost:3000/api/config/handleYearSchedule?type=veg');

        const plusDates = await plusRes.json();
        const breakDates = await szunetRes.json();
        const schoolStart = await startRes.json();
        const schoolEnd = await endRes.json();

        setYearSchedule({
          plusDates: plusDates.plusDates_alap,
          breakDates: breakDates.breakDates_alap,
          schoolStart: schoolStart.schoolYearStart.start,
          schoolEnd: schoolEnd.schoolYearEnd.end
        });
        setSchoolStartEdit(schoolStart.schoolYearStart.start);
        setSchoolEndEdit(schoolEnd.schoolYearEnd.end);
      } catch (error) {
        console.error('Error fetching year schedule:', error);
      }
    };
    fetchYearSchedule();
  }, []);

  const updateSchoolYear = async (type: string, date: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/config/setYearStartEnd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, which_day: date }),
      });
      if (response.ok) {
        setMessage(`${type === 'kezd' ? 'Tanév kezdete' : 'Tanév vége'} sikeresen frissítve!`);
        setYearSchedule((prev: any) => ({ ...prev, [type === 'kezd' ? 'schoolStart' : 'schoolEnd']: date }));
      } else {
        setMessage('Hiba történt az adat frissítésekor.');
      }
    } catch (error) {
      setMessage(`Hiba: ${error}`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
      setMessage(`Selected file: ${e.dataTransfer.files[0].name}`);
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setMessage(`Selected file: ${e.target.files[0].name}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a CSV file first!');
      setApiResponse(null);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:3000/api/config/addStudent', {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();
      setApiResponse(responseData);

      if (response.ok) {
        setMessage('File uploaded successfully!');
      } else {
        setMessage('Error occurred during file upload.');
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setApiResponse(null);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Konfigurációs felület</h1>
      <p>Diák hozzáadása:</p>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: '2px dashed #007bff',
          borderRadius: '5px',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          cursor: 'pointer',
          marginBottom: '10px',
        }}
      >
        {selectedFile ? selectedFile.name : 'Drag and drop a file here, or click to select'}
      </div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        onClick={handleUpload}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Feltöltés
      </button>
      {message && (
        <p style={{ marginTop: '20px', color: message.startsWith('Error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
      {apiResponse && (
        <pre style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '5px' }}>
          {JSON.stringify(apiResponse, null, 2)}
        </pre>
      )}
      <h2>Tanév beállítása</h2>
      <label>Tanév kezdete:</label>
      <input
        type="date"
        value={schoolStartEdit}
        onChange={(e) => setSchoolStartEdit(e.target.value)}
      />
      <button onClick={() => updateSchoolYear('kezd', schoolStartEdit)}>Mentés</button>
      <label>Tanév vége:</label>
      <input
        type="date"
        value={schoolEndEdit}
        onChange={(e) => setSchoolEndEdit(e.target.value)}
      />
      <button onClick={() => updateSchoolYear('veg', schoolEndEdit)}>Mentés</button>
      <h3>Aktuális tanév kezdete:</h3>
      <p>{yearSchedule.schoolStart}</p>
      <h3>Aktuális tanév vége:</h3>
      <p>{yearSchedule.schoolEnd}</p>
    </div>
  );
};

export default Configuration;
