// app/layout.tsx
import React from 'react';
import '../globals.css';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
 

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
    </div>
  );
};

export default Layout;
