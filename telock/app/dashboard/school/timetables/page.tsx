// app/dashboard/school/timetables/page.tsx
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

// Session típus definiálása
interface Session {
  user: {
    role: string;
    email: string;
    // További felhasználói adatok...
  };
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  // Ha nincs bejelentkezve a felhasználó, átirányítás a bejelentkezési oldalra
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Ellenőrizd a felhasználó szerepkörét
  if (session.user?.position !== 'igazgató') {
    // Ha a felhasználó nem "igazgató", átirányítás egy másik oldalra (pl. dashboard főoldal)
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  // Ha a felhasználó "igazgató", engedélyezd az oldal megjelenítését
  return {
    props: { session },
  };
}

interface TimetablePageProps {
  session: Session;
}

export default function TimetablePage({ session }: TimetablePageProps) {
  return (
    <div>
      <h1>Órarend</h1>
      <p>Csak az igazgatók láthatják ezt az oldalt.</p>
      <p>Bejelentkezve mint: {session.user.email}</p>
    </div>
  );
}