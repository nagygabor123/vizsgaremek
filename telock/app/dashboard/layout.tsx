import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";  // 👈 Fontos

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( 
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
