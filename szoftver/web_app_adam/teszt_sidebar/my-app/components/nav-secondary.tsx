import * as React from "react"

import { Settings, CalendarRange, Users, ChevronDown, LayoutDashboard, LifeBuoy, ChevronRight, type LucideIcon } from "lucide-react"

import Link from "next/link"; // Ha Next.js-t használsz
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup>
   
   <SidebarGroupContent>
     <SidebarMenu>
     <SidebarMenuItem>



<SidebarMenuButton asChild size="sm">
 <Link href="#">
   <LifeBuoy />
   <span>Súgó</span>
 </Link>
</SidebarMenuButton>
<SidebarMenuButton asChild size="sm">
 <Link href="#">
   <Settings/>
   <span>Beállítások</span>
 </Link>
</SidebarMenuButton>


       </SidebarMenuItem>
     </SidebarMenu>
   </SidebarGroupContent>
 </SidebarGroup>
  )
}
