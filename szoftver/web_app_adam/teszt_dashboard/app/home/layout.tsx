import '../globals.css';
import Sidebar2 from '../../components/Sidebar';
import { ReactNode } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
export const metadata = {
  title: 'Next.js Multi-Page App',
  description: 'A sample multi-page app using Next.js with the App Router',
};

const RootLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
      <SidebarProvider>
        <Sidebar2 />
        <main className="main-content">{children}</main>
      </SidebarProvider>
      </body>
    </html>
  );
};

export default RootLayout;
