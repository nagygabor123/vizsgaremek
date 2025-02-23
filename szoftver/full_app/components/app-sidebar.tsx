"use client"

import { usePathname } from "next/navigation";

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  FileText,
  Flag,
  LifeBuoy,
  Map,
  ShieldHalf,
  TriangleAlert,
  PieChart,
  Send,
  Settings2,
  MessageCircleWarning,
  MessageSquareWarning,
  SquareTerminal,
  GalleryVerticalEnd, 
  Users,
  SquareArrowOutUpRight,
  Eye,
  Settings,
  SlidersHorizontal,
  House,
  Home,
  CalendarSearch,
  BellElectric,
  ExternalLink,
  ChevronsUpDown,
  BookUser,
  Bolt,
  UserCog,
  SquarePen,
  UserRound,
  UserRoundSearch,
  ChevronDown,
  MessageCircleQuestion,
  CircleUser,
  CalendarCog,
  Backpack,
  GraduationCap,
  BookType,
  CalendarSync,
  FileClock,
  Shield,
  BriefcaseBusiness,
  School,
  LogOut,
  User,
  UserSearch,
  CalendarHeart,
  Calendar,
  CircleAlert,
  School2
} from "lucide-react"



import {
  Sidebar,
  SidebarTrigger,
  SidebarInset,
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
  AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";
import { useState, useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar()
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  // Gomb kattintás kezelése
  const handleButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleConfirmClick = () => {
    setOverlayVisible(false);
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
  };

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
                <AvatarFallback className="rounded-lg bg-lime-300">VZ</AvatarFallback>
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
                  <AvatarFallback className="rounded-lg bg-lime-300">VZ</AvatarFallback>
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
              <Link href="/help">
              <LifeBuoy/>
            
              <span>Súgóközpont</span>
              </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
              <Link href="/report">
              
              <Flag/>
              <span>Probléma jelentése</span>
              </Link>
              </DropdownMenuItem>

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
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
    <span>Tanóráim</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
    
          <SidebarGroup>
          <SidebarGroupLabel>Osztály</SidebarGroupLabel>
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
  <UserRound/>
    <span>Tanulók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
 

    <SidebarGroup>
          <SidebarGroupLabel>Adminisztráció</SidebarGroupLabel>
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
<CalendarSearch/>
    <span>Órarendek</span>
    {isButtonVisible && (
    <TriangleAlert className="ml-auto text-red-500" />
    )}
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
<SidebarMenuButton asChild isActive={isActive("/dashboard/school/students")}>
  <Link href="/dashboard/school/students">
<UserRoundSearch/>
    <span>Tanulók</span> 
    {isButtonVisible && (
    <TriangleAlert className="ml-auto text-red-500" />
    )}
  </Link>
  
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild isActive={isActive("/dashboard/school/employees")}>
  <Link href="/dashboard/school/employees">
  <BriefcaseBusiness/>
    <span>Alkalmazottak</span>
    {isButtonVisible && (
    <TriangleAlert className="ml-auto text-red-500" />
    )}
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



      </SidebarMenu>
    </SidebarGroup>
 



    <SidebarGroup>
          <SidebarGroupLabel>Rendszer</SidebarGroupLabel>
      <SidebarMenu>

      <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive("/dashboard/school/settings")}>
  <Link href="/dashboard/school/settings">
<SlidersHorizontal/>
    <span>Tanév beállításai</span>
    {isButtonVisible && (
    <TriangleAlert className="ml-auto text-red-500" />
    )}
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
<SidebarMenuButton asChild isActive={isActive("/dashboard/school/logs")}>
  <Link href="/dashboard/school/logs">
  <FileClock/>
    <span>Tevékenységnapló</span>
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
