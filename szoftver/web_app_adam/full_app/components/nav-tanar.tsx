"use client"

import { Calendar1, type LucideIcon } from "lucide-react"

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

export function NavTanar({
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
      <SidebarGroupLabel>Általános</SidebarGroupLabel>
      <SidebarMenu>
      <SidebarMenuButton asChild>
  <Link href="/dashboard/calendar">
    <Calendar1 />
    <span>Tanóráim</span>
  </Link>
</SidebarMenuButton>
      </SidebarMenu>
    </SidebarGroup>
  )
}
