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
  <Link href="/dashboard/calendar">
    <Calendar1 />
    <span>Tanórák</span>
  </Link>
</SidebarMenuButton>

<SidebarGroupLabel>Osztályfőnök</SidebarGroupLabel>


<SidebarMenuButton asChild>
  <Link href="">
    <span>Osztály órarendje</span>
  </Link>
</SidebarMenuButton>

<SidebarMenuButton asChild>
  <Link href="">
    <span>Osztály tanulói</span>
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

<span>Órarendek</span>
</Link>
</SidebarMenuButton>

<SidebarMenuButton asChild>
<Link href="">
<span>Tanulók listája</span>
</Link>
</SidebarMenuButton>

<SidebarMenuButton asChild>
<Link href="">
<span>Alkalmazottak listája</span>
</Link>
</SidebarMenuButton>

<SidebarMenuButton asChild>
<Link href="">
<span>Helyettesítések</span>
</Link>
</SidebarMenuButton>

<SidebarMenuButton asChild>
<Link href="">
<span>Tevékenységi napló</span>
</Link>
</SidebarMenuButton>

<SidebarMenuButton asChild>
<Link href="">
<span>Tanév rendje</span>
</Link>
</SidebarMenuButton>

<SidebarMenuButton asChild>
<Link href="">
<span>Csengetési rend</span>
</Link>
</SidebarMenuButton>



</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
  )
}
