"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  FileText,
  LifeBuoy,
  Map,
  ShieldHalf,
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


import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
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


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar()


  return (
    // variant="inset"
    <Sidebar variant="inset" className="border-r-0" {...props}>
      <SidebarHeader>
      <DropdownMenu>
<DropdownMenuTrigger asChild>
  <SidebarMenuButton
    size="lg"
    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
  >
  <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate text-s">Kiskunfélegyházi Szent</span>
        <span className="truncate text-s">Benedek PG Középiskola</span>
      </div>
  
   
    <Avatar className="h-7 w-7 rounded-full ">
      <AvatarFallback className="rounded-lg bg-lime-300 ml-auto">VZ</AvatarFallback>
    </Avatar>
    <ChevronDown className="ml-auto size-4" />
  </SidebarMenuButton>
</DropdownMenuTrigger>
<DropdownMenuContent>
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
{/* <DropdownMenuGroup>
    <DropdownMenuItem>
    <LifeBuoy/> 
      Súgóközpont
    </DropdownMenuItem>
    <DropdownMenuItem>
    <MessageCircleWarning/> 
      Probléma jelentése
    </DropdownMenuItem>
    <DropdownMenuItem>
    <Settings /> 
      Beállítások
    </DropdownMenuItem>
  </DropdownMenuGroup>*/}


  <DropdownMenuSeparator />
  <DropdownMenuGroup>
  <DropdownMenuItem>
   <LogOut /> 
    Kijelentkezés
  </DropdownMenuItem>
  </DropdownMenuGroup>
</DropdownMenuContent>
</DropdownMenu>

        <Separator/>
      </SidebarHeader>

      <SidebarContent>

      <SidebarGroup>
      <SidebarMenu>
      {/* <SidebarMenuItem>
      <SidebarMenuButton asChild>
        
  <Link href="">
  <Home/>
    <span>Konfigurátor</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem> */}


      <SidebarMenuItem>
      <SidebarMenuButton asChild>
        
  <Link href="">
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
  <Link href="r">
  <Calendar/>
    <span>Órarend</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <Users/>
    <span>Tanulók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
 

    <SidebarGroup>
          <SidebarGroupLabel>Iskola</SidebarGroupLabel>
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
  <Link href="">
<CalendarSearch/>
    <span>Órarendek</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
<UserSearch/>
    <span>Tanulók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <BriefcaseBusiness/>
    <span>Alkalmazottak</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>

<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
<SlidersHorizontal/>
    <span>Tanév beállításai</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <FileClock/>
    <span>Tevékenységnapló</span>
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
  <Link href="">
  <LifeBuoy/>
    <span>Súgóközpont</span>

  </Link>
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <MessageCircleWarning/>
  <span>Probléma jelentése</span>

  </Link>
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <Settings/>
    <span>Beállítások</span>

  </Link>
</SidebarMenuButton>
</SidebarMenuItem>


      </SidebarMenu>
    </SidebarGroup>




      </SidebarContent>
      <SidebarFooter>
    


      <SidebarMenu className="mt-auto">
{/* 
      <SidebarMenuItem>
      <SidebarMenuButton asChild size="sm">
        
  <Link href="">
  <Settings/>
    <span>Beállítások</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>  */}

   {/* <SquareArrowOutUpRight className="ml-auto" />*/}
{/*
      <SidebarMenuItem>
      <SidebarMenuButton asChild size="sm">
        
  <Link href="">
  <LifeBuoy/>
    <span>Súgóközpont</span>

  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
      <SidebarMenuButton asChild size="sm">
        
  <Link href="">
  <MessageCircleWarning/>
    <span>Probléma jelentése</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
      <SidebarMenuButton asChild size="sm">
        
  <Link href="">
  <Settings/>
    <span>Beállítások</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>*/}

      </SidebarMenu>

    
      <span className="text-xs text-center">powered by teLock</span>
      </SidebarFooter>
    </Sidebar>
  )
}
