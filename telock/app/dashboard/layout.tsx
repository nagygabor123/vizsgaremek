// app/dashboard/layout.tsx
import { AppSidebar } from "@/components/app-sidebar";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen">
      <AppSidebar className="hidden md:flex" />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}