"use client";

import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Providers({
  children,
  session
}: {
  children: React.ReactNode;
  session: any; // vagy használj pontos típusdefiníciót
}) {
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </SessionProvider>
  );
}