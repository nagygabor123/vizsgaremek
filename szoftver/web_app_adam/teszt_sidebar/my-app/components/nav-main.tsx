"use client"

import { Settings, CalendarRange, Users, ChevronDown, LayoutDashboard, LifeBuoy, ChevronRight, type LucideIcon, Calendar1 } from "lucide-react"

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
        <SidebarGroupLabel>Tanári</SidebarGroupLabel>

    <SidebarGroupContent>
      
  
      <SidebarMenu>
      <SidebarMenuItem>

<SidebarMenuButton asChild>
  <Link href="">
    <Calendar1 />
    <span>Tanórák</span>
  </Link>
</SidebarMenuButton>



<SidebarGroupLabel>Osztályfőnök</SidebarGroupLabel>
<SidebarMenuButton asChild>
  <Link href="">
    <Calendar1 />
    <span>Tanórák</span>
  </Link>
</SidebarMenuButton>

        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>

    <SidebarGroupLabel>Iskola</SidebarGroupLabel>

<SidebarGroupContent>
  

  <SidebarMenu>
  <SidebarMenuItem>

<SidebarMenuButton asChild>
<Link href="">
<Calendar1 />
<span>Órarendek</span>
</Link>
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
  )
}
