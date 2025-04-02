"use client"; 

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;  // Fontos: Itt legyen opcionális a session prop!
}

export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
