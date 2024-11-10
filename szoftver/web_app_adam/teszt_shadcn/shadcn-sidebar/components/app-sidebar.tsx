"use client"

import * as React from "react"
import {
  Bell,
  BookOpen,
  Bot,
  Calendar,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
// import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Vincze Zsolt",
    email: "vincze.zsolt@szbi-pg.hu",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Naptár",
      url: "fasz",
      icon: Calendar,
      isActive: true,
   
    },
    {
      title: "TESZT",
       url: "#",
      icon: Bot,
  
   },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,

    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
     
    // },
  ],
  navSecondary: [
    {
      title: "Súgó",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Beállítások",
      url: "#",
      icon: Settings2,
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
               <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div> 
                
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Kiskunfélegyházi Szent Benedek PG Két Tanítási Nyelvű Technikum és Koll. </span>
                  <span className="truncate text-xs">szbi-kiskunfelegyhaza</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
