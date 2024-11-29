"use client"

import { Settings, Calendar1, LayoutDashboard, LifeBuoy, ChevronRight, type LucideIcon } from "lucide-react"

import Link from "next/link"; // Ha Next.js-t használsz
import { Separator } from "@/components/ui/separator"



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

      <Separator className="my-1" />

<SidebarMenuButton asChild>
  <Link href="/dashboard/calendar">
    <Calendar1 />
    <span>Tanórák</span>
  </Link>
</SidebarMenuButton>


{/* <SidebarMenuButton asChild>
  <Link href="/dashboard">
    <LayoutDashboard />
    <span>Dashboard</span>
  </Link> 
</SidebarMenuButton> */}

<SidebarMenuButton asChild>
  <Link href="/dashboard/settings">
    <Settings />
    <span>Beállítások</span>
  </Link>
</SidebarMenuButton>

<Separator className="my-1" />

<SidebarMenuButton asChild>
  <Link href="#">
    <LifeBuoy />
    <span>Súgó</span>
  </Link>
</SidebarMenuButton>

        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
  )
}
