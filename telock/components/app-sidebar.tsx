"use client"

import { usePathname } from "next/navigation";

import * as React from "react"
import {

  TriangleAlert,

  Settings,
  SlidersHorizontal,
  ChevronDown,
  GraduationCap,
  FileClock,
  
  BriefcaseBusiness,
  
  LogOut,

  CalendarHeart,
  Calendar,
 
} from "lucide-react"



import {
  Sidebar,
 // SidebarTrigger,
 // SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  useSidebar,

} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"


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
 // AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";
import { useState, useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar()
  //const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);


  //const [students, setStudents] = useState<any[]>([]);
  const [hasStudents, setHasStudents] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true); // Betöltési állapot


  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students/read');
      const data = await response.json();
     // setStudents(data);
      setHasStudents(data.length > 0); // Ha van legalább egy diák, akkor true
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false); // Lekérés vége
    }
  };
  

  useEffect(() => {
    fetchStudents();
  }, []);


  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  // Gomb kattintás kezelése
  /*const handleButtonClick = () => {
    setOverlayVisible(true);
  };*/

  /*const handleConfirmClick = () => {
    setOverlayVisible(false);
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
  };*/

  // Addig ne rendereljük a gombot, amíg nem töltöttük be az adatot
  if (isButtonVisible === null) {
    return null; // Várakozás a localStorage betöltésére
  }

  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;


  return (
    // variant="inset"
    <Sidebar variant="inset" className="border-r-0" {...props}>
      <SidebarHeader>
      <DropdownMenu >
        
          <DropdownMenuTrigger asChild>
            
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
               <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-s truncate">Kiskunfélegyházi Szent</span>
                <span className="text-s truncate">Benedek PG Középiskola</span>
                
              </div>
           
              <Avatar className="h-9 w-9 rounded-full">
                <AvatarFallback className="rounded-lg bg-lime-300">ViZs</AvatarFallback>
              </Avatar>
              <ChevronDown className="ml-auto size-4" />
            
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-full">
                  <AvatarFallback className="rounded-lg bg-lime-300">ViZs</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Vincze Zsolt</span>
                  <span className="truncate text-xs">vincze.zsolt@szbi-pg.hu</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
              <Settings/>
            
              <span>Beállítások</span>
              </Link> 
              </DropdownMenuItem>
              {/* <DropdownMenuItem asChild>
              <Link href="/dashboard/report">
              
              <Flag/>
              <span>Probléma jelentése</span>
              </Link>
              </DropdownMenuItem> */}

            </DropdownMenuGroup>
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem>
            <LogOut/>
            <span>Kijelentkezés</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator/>
      </SidebarHeader>

      <SidebarContent>

      <SidebarGroup>
      <SidebarMenu>



      <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive("/dashboard/timetable")}>
        
  <Link href="/dashboard/timetable">
  <CalendarHeart/>
    <span>Saját órák</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
    
          <SidebarGroup>
          <SidebarGroupLabel>Osztályom</SidebarGroupLabel>
      <SidebarMenu>
      <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive("/dashboard/class/timetable")}>
  <Link href="/dashboard/class/timetable">
  <Calendar/>
    <span>Órarend</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild isActive={isActive("/dashboard/class/students")}>
  <Link href="/dashboard/class/students">
  <GraduationCap/>
    <span>Tanulók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
 

    <SidebarGroup>
          <SidebarGroupLabel>Iskolai nyilvántartás</SidebarGroupLabel>
      <SidebarMenu>

{/*
      <SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
<CalendarSync/>
    <span>Helyettesítések</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>*/}

      <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive("/dashboard/school/timetables")}>
  <Link href="/dashboard/school/timetables">
<Calendar/>
    <span>Órarendek</span>
  
    {loading ? (
     
        <p></p>
     
    ) : (
      <>
        {!hasStudents && <TriangleAlert className="ml-auto text-red-500" />}
      </>
    )}
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
<SidebarMenuButton asChild isActive={isActive("/dashboard/school/students")}>
  <Link href="/dashboard/school/students">
  <GraduationCap/>
    <span>Tanulók</span> 
    {loading ? (
     
     <p></p>
  
 ) : (
   <>
     {!hasStudents && <TriangleAlert className="ml-auto text-red-500" />}
   </>
 )}
  </Link>
  
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild isActive={isActive("/dashboard/school/employees")}>
  <Link href="/dashboard/school/employees">
  <BriefcaseBusiness/>
    <span>Munkatársak</span>
    {loading ? (
     
     <p></p>
  
 ) : (
   <>
     {!hasStudents && <TriangleAlert className="ml-auto text-red-500" />}
   </>
 )}
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



      </SidebarMenu>
    </SidebarGroup>
 



    <SidebarGroup>
          <SidebarGroupLabel>Beállítások és naplózás</SidebarGroupLabel>
      <SidebarMenu>

      <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive("/dashboard/school/settings")}>
  <Link href="/dashboard/school/settings">
<SlidersHorizontal/>
    <span>Tanév beállításai</span>
    {/*{isButtonVisible && (*/}
   {/* <TriangleAlert className="ml-auto text-red-500" />*/}
     {/* )}  */}
  </Link> 
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
<SidebarMenuButton asChild isActive={isActive("/dashboard/school/logs")}>
  <Link href="/dashboard/school/logs">
  <FileClock/>
    <span>Eseménynapló</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>

      </SidebarMenu>
    </SidebarGroup>




      </SidebarContent>
      <SidebarFooter>
    


      <SidebarMenu className="mt-auto">


      </SidebarMenu>

    
      <span className="text-xs text-center">powered by teLock</span>
      </SidebarFooter>
    </Sidebar>
  )
}
