//https://vizsgaremek-mocha.vercel.app/dashboard/school/timetables
// app/dashboard/school/timetables/page.tsx
"use client"; // Client Componentként definiálás

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TimetablePage() {
  const { data: session, status } = useSession();
  const [timetableData, setTimetableData] = useState(null);

  useEffect(() => {
    // Ha nincs bejelentkezve a felhasználó, átirányítás a bejelentkezési oldalra
    if (status === 'unauthenticated') {
      redirect('/login');
    }

    // Ellenőrizd a felhasználó szerepkörét
    if (session?.user?.position !== 'igazgato') {
      // Ha a felhasználó nem "igazgató", átirányítás egy másik oldalra (pl. dashboard főoldal)
      redirect('/dashboard');
    }

  }, [session, status]);

  // Ha a session még betöltődik, jeleníts meg egy betöltési állapotot
  if (status === 'loading') {
    return <p>Betöltés...</p>;
  }

  // Ha a felhasználó "igazgató", engedélyezd az oldal megjelenítését
  return (
    <div>
      <h1>Órarend</h1>
      <p>Csak az igazgatók láthatják ezt az oldalt.</p>
      <p>Bejelentkezve mint: </p>
    
    </div>
  );
}