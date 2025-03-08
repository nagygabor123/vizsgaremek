// app/providers.tsx
"use client"; // Jelöld meg, hogy ez egy kliensoldali komponens

import { SessionProvider } from "next-auth/react";

export default function Providers({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}