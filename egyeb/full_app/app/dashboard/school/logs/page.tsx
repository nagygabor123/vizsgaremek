import { AppSidebar } from "@/components/app-sidebar"
import {
   ChevronDown, Slash

} from "lucide-react"


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  useSidebar,

} from "@/components/ui/sidebar"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link";

export default function Page() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Kezdőlap</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Beállítások és naplózás</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>Eseménynapló</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            {/* <NavActions /> */}
            


     
  
          </div>
        </header>

összes api kérés logolva, 72 óráig, adatbázisba mentse, onnan töltse be, és 72 óa után törölje



      </SidebarInset>
    </SidebarProvider>
    
  )
}
