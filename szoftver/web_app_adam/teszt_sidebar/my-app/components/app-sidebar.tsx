"use client"

import * as React from "react"


import { Calendar, Home, LifeBuoy, Inbox, Search, Settings, School} from "lucide-react"

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

import { Separator } from "@/components/ui/separator"



import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


const data = {
  user: {
    name: "Vincze Zsolt",
    email: "vincze.zsolt@szbi-pg.hu",
    avatar: "",
  },
  navMain: [
    {
      title: "Calendar",
      url: "calendar",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Súgó",
      url: "#",
      icon: LifeBuoy,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <School className="size-4" />
                </div> */}
                  {/* <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={data.user.avatar} />
                <AvatarFallback className="rounded-xl">PG</AvatarFallback>
              </Avatar> */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Szent Benedek PG Technikum</span>
                  <span className="truncate text-xs">szbi-kiskunfelegyhaza</span> 
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
       
        {/* <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <NavSecondary items={data.navSecondary} className="mt-auto" />
      <SidebarFooter>
     
        <NavUser user={data.user} />
        {/* <Separator className="my-1" />
        <span className="text-xs text-center">Powered by telock</span> */}
      </SidebarFooter>
          {/* <span className="text-xs text-center">Powered by telock</span> <span className="text-xs text-center">© 2024 telock.hu, Kft. v.0.1</span>   */}
    </Sidebar>
  )
}
