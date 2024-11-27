import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import Link from 'next/link';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              
                <SidebarMenuItem>
                  <SidebarMenuButton>
                  <Link href="/dashboard">DASHBOARD</Link>
      
                  </SidebarMenuButton>
                </SidebarMenuItem>
              

                <SidebarMenuItem>
                <SidebarMenuButton>
                <Link href="/dashboard/calendar">Calendar</Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton>
        <Link href="/dashboard/settings">Settings</Link>
        </SidebarMenuButton>
        </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
