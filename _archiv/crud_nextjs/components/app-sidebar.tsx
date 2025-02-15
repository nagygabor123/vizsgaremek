"use client"

import { usePathname } from "next/navigation";

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  FileText,
  Flag,
  LifeBuoy,
  Map,
  ShieldHalf,
  TriangleAlert,
  PieChart,
  Send,
  Settings2,
  MessageCircleWarning,
  MessageSquareWarning,
  SquareTerminal,
  GalleryVerticalEnd, 
  Users,
  SquareArrowOutUpRight,
  Eye,
  Settings,
  SlidersHorizontal,
  House,
  Home,
  CalendarSearch,
  BellElectric,
  ExternalLink,
  ChevronsUpDown,
  BookUser,
  Bolt,
  UserCog,
  SquarePen,
  UserRound,
  UserRoundSearch,
  ChevronDown,
  MessageCircleQuestion,
  CircleUser,
  CalendarCog,
  Backpack,
  GraduationCap,
  BookType,
  FileClock,
  Shield,
  BriefcaseBusiness,
  School,
  LogOut,
  User,
  UserSearch,
  CalendarHeart,
  Calendar,
  CircleAlert,
  School2
} from "lucide-react"



import {
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  useSidebar,

} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";

import { useState, useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
  
  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  // Gomb kattintás kezelése
  const handleButtonClick = () => {
    setOverlayVisible(true);
  };

  const handleConfirmClick = () => {
    setOverlayVisible(false);
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
  };

  if (isButtonVisible === null) {
    return null; // Várakozás a localStorage betöltésére
  }

  const pathname = usePathname();
  
  const isActive = (path: string) => (pathname ?? "") === path;

  return (
    <Sidebar variant="inset" className="border-r-0" {...props}>
      <SidebarHeader>
        <SidebarMenuButton size="lg">
          <span>Kiskunfélegyházi Szent Benedek PG Középiskola</span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/timetable")}>
                <Link href="/dashboard/timetable">
                  <CalendarHeart />
                  <span>Tanóráim</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Osztály</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/class/timetable")}>
                <Link href="/dashboard/class/timetable">
                  <Calendar />
                  <span>Órarend</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/class/students")}>
                <Link href="/dashboard/class/students">
                  <UserRoundSearch />
                  <span>Tanulók</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Adminisztráció</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/school/timetables")}>
                <Link href="/dashboard/school/timetables">
                  <CalendarSearch />
                  <span>Órarendek</span>
                  {isButtonVisible && (
                    <TriangleAlert className="ml-auto text-amber-400" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Rendszer</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/school/settings")}>
                <Link href="/dashboard/school/settings">
                  <SlidersHorizontal />
                  <span>Tanév beállításai</span>
                  {isButtonVisible && (
                    <TriangleAlert className="ml-auto text-amber-400" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
