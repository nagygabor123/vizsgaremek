"use client"

import { Settings, Calendar1, LayoutDashboard, ChevronRight, type LucideIcon } from "lucide-react"

import Link from "next/link"; // Ha Next.js-t használsz


import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Calendar from "@/app/dashboard/calendar/page";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup>
    {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
    <SidebarGroupContent>
      <SidebarMenu>
      <SidebarMenuItem>
                  <SidebarMenuButton>
                  < LayoutDashboard />
                  <Link href="/dashboard">Dashboard</Link>
      
                  </SidebarMenuButton>
                </SidebarMenuItem>
              

                <SidebarMenuItem>
               
                <SidebarMenuButton>
                <Calendar1 />
                <Link href="/dashboard/calendar">Calendar</Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton>
                <Settings />
        <Link href="/dashboard/settings">Settings</Link>
        </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
  )
}
