// app/dashboard/school/timetables/page.tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options'; // Az authOptions importálása
import { redirect } from 'next/navigation';

export default async function TimetablePage() {
  // Session lekérése szerveroldalon
  const session = await getServerSession(authOptions);

  // Ha nincs bejelentkezve a felhasználó, átirányítás a bejelentkezési oldalra
  if (!session) {
    redirect('/login');
  }

  // Ellenőrizd a felhasználó szerepkörét
  if (session.user?.position !== 'igazgato') {
    // Ha a felhasználó nem "igazgató", átirányítás egy másik oldalra (pl. dashboard főoldal)
    redirect('/dashboard');
  }

  // Ha a felhasználó "igazgató", engedélyezd az oldal megjelenítését
  return (
    <div>
      <h1>Órarend</h1>
      <p>Csak az igazgatók láthatják ezt az oldalt.</p>
      <p>Bejelentkezve mint</p>
    </div>
  );
}