"use client"

import { Settings, CalendarRange, Users, ChevronDown, LayoutDashboard, LifeBuoy, ChevronRight, type LucideIcon } from "lucide-react"

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


<SidebarMenuButton asChild>
  <Link href="/dashboard/calendar">
    <CalendarRange />
    <span>Órarend</span>
  </Link>
</SidebarMenuButton>


{/* <SidebarMenuButton asChild>
  <Link href="/dashboard">
    <LayoutDashboard />
    <span>Dashboard</span>
  </Link> 
</SidebarMenuButton> */}


<SidebarMenu>
  <Collapsible defaultOpen className="group/collapsible">
    <SidebarMenuItem>
    <CollapsibleTrigger asChild>
    <SidebarMenuButton>
    <Users />
    <span>Saját osztály</span>
    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
</SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
        <SidebarMenuSubItem>
    <SidebarMenuButton asChild>
  <Link href="#">
    <span>Órarend</span>
  </Link>
</SidebarMenuButton>
    </SidebarMenuSubItem>
    <SidebarMenuSubItem>
    <SidebarMenuButton asChild>
  <Link href="#">
    <span>Tanulók listája</span>
  </Link>
</SidebarMenuButton>
    </SidebarMenuSubItem>
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
</SidebarMenu>







<SidebarMenuButton asChild>
  <Link href="/dashboard/settings">
    <Settings />
    <span>Beállítások</span>
  </Link>
</SidebarMenuButton>

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
