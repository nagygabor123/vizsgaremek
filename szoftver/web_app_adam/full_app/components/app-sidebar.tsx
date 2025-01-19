"use client"

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


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar()


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
                <AvatarFallback className="rounded-lg bg-emerald-200">VZ</AvatarFallback>
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
                  <AvatarFallback className="rounded-lg bg-emerald-200">VZ</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Vincze Zsolt</span>
                  <span className="truncate text-xs">vincze.zsolt@szbi-pg.hu</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
               
              <LifeBuoy/>
              <span>Súgóközpont</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
              
              <Flag/>
              <span>Probléma jelentése</span>
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
      <SidebarMenuButton asChild>
        
  <Link href="/dashboard/timetable">
  <CalendarHeart/>
    <span>Saját óráim</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
    
          <SidebarGroup>
          <SidebarGroupLabel>Saját osztály</SidebarGroupLabel>
      <SidebarMenu>
      <SidebarMenuItem>
      <SidebarMenuButton asChild>
  <Link href="/dashboard/class/timetable">
  <Calendar/>
    <span>Órarend</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="/dashboard//class/students">
  <Users/>
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
      <SidebarMenuButton asChild>
  <Link href="/dashboard/school/timetable">
<CalendarSearch/>
    <span>Órarendek</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="/dashboard/school/students">
<UserSearch/>
    <span>Tanulók</span> 
    <TriangleAlert className="ml-auto text-amber-400" />
  </Link>
  
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="/dashboard/school/teachers">
  <BriefcaseBusiness/>
    <span>Alkalmazottak</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



      </SidebarMenu>
    </SidebarGroup>
 



    <SidebarGroup>
          <SidebarGroupLabel>Rendszer</SidebarGroupLabel>
      <SidebarMenu>

      <SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="/dashboard/school/settings">
<SlidersHorizontal/>
    <span>Tanév beállításai</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
<SidebarMenuButton asChild>
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
