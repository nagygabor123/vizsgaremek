"use client"

import { Calendar, type LucideIcon } from "lucide-react"

import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavTanar()
{
  return (
    <SidebarGroup>
    {/*  <SidebarGroupLabel>Általános</SidebarGroupLabel>*/}
      <SidebarMenu>
      <SidebarMenuButton asChild>
  <Link href="/dashboard/calendar">
    <Calendar />
    <span>Tanóráim</span>
  </Link>
</SidebarMenuButton>
      </SidebarMenu>
    </SidebarGroup>
  )
}
