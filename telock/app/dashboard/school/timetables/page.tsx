"use client";
import { useState, useEffect } from "react";
import AuthCheck from "@/components/AuthCheck"; // Importáljuk a szerverkomponenst

const Calendar = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Példa: itt maradhat a kliensoldali logika
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div>
      <AuthCheck /> {/* Szerveroldali ellenőrzés */}
      <h1>Naptár oldal</h1>
    </div>
  );
};

export default Calendar;
