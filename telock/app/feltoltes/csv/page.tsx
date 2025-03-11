'use client';

import { useState, useRef } from 'react';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: unknown; // Replace `unknown` with a more specific type if possible
}

const Configuration = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const response = await fetch('api/setup/studentsToDatabase', {
        method: 'POST',
        body: formData,
      });

      const responseData: ApiResponse = await response.json();
      setApiResponse(responseData);

      if (response.ok) {
        setMessage('File uploaded successfully!');
      } else {
        setMessage('Error occurred during file upload.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage('An unknown error occurred.');
      }
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
    </div>
  );
};

export default Configuration;