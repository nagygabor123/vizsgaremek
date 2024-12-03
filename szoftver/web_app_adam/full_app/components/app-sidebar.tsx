"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  GalleryVerticalEnd, 
  Users,
  CalendarSearch,
  BookUser,
  Backpack,
  GraduationCap,
  CalendarSync,
  
  LogOut,
  CalendarHeart,
  Calendar
} from "lucide-react"

import { NavTanar } from "@/components/nav-tanar"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,

} from "@/components/ui/sidebar"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";

{/*
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
*/}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
              {/*<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>*/}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Kiskunfélegyházi Szent Benedek PG</span>
                  <span className="truncate text-xs">Két Tanítási Nyelvű Technikum és Kollégium</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>

      <SidebarGroup>
      <SidebarMenu>
      <SidebarMenuItem>
      <SidebarMenuButton asChild>
        
  <Link href="">
  <CalendarHeart/>
    <span>Tanóráim</span>
    
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
  <Backpack/>
    <span>Tanulók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
 

    <SidebarGroup>
          <SidebarGroupLabel>Iskola</SidebarGroupLabel>
      <SidebarMenu>
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
<CalendarSync/>
    <span>Helyettesítések</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>

<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
<Backpack/>
    <span>Tanulók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <Users/>
    <span>Alkalmazottak</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">

    <span>Tanév rendje</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">

    <span>Tevékenységi napló</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>

      </SidebarMenu>
    </SidebarGroup>
 




      </SidebarContent>
      <SidebarFooter>
      <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
      {/*<Avatar className="h-8 w-8 rounded-lg">  
                <AvatarFallback className="rounded-lg">VZ</AvatarFallback>
              </Avatar>*/}
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Vincze Zsolt</span>
                <span className="truncate text-xs">vincze.zsolt@szbi-pg.hu</span>
              </div>
              <LogOut className="ml-auto size-4" />
      </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
