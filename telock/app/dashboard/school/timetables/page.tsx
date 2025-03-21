"use client";
import AuthCheck from "@/components/AuthCheck"; // Importáljuk a szerverkomponenst
import { useEffect, useState } from "react";

const Calendar = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Itt maradhat minden más useEffect-alapú klienslogika
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
