"use client"

import Link from 'next/link'; // Import the Link component
import * as React from "react";
import {
  TriangleAlert,
  Settings,
  SlidersHorizontal,
  ChevronDown,
  GraduationCap,
  FileClock,
  BriefcaseBusiness,
  LogOut,
  CalendarHeart,
  Calendar,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { useState, useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
  const [hasStudents, setHasStudents] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students/read');
      const data = await response.json();
      setHasStudents(data.length > 0);
    } catch (error) {
      console.error('Error fetching students', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  if (isButtonVisible === null) {
    return null;
  }

  return (
    <Sidebar variant="inset" className="border-r-0" {...props}>
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="text-s truncate">Kiskunfélegyházi Szent</span>
                <span className="text-s truncate">Benedek PG Középiskola</span>
              </div>
              <Avatar className="h-9 w-9 rounded-full">
                <AvatarFallback className="rounded-lg bg-lime-300">ViZs</AvatarFallback>
              </Avatar>
              <ChevronDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-full">
                  <AvatarFallback className="rounded-lg bg-lime-300">ViZs</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Vincze Zsolt</span>
                  <span className="truncate text-xs">vincze.zsolt@szbi-pg.hu</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/dashboard/settings" className="flex items-center">
                  <Settings />
                  <span className="ml-2">Beállítások</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem>
              <div className="flex items-center">
                <LogOut />
                <span className="ml-2">Kijelentkezés</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/timetable" className="flex items-center">
                <CalendarHeart />
                <span className="ml-2">Saját órák</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Osztályom</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/class/timetable" className="flex items-center">
                <Calendar />
                <span className="ml-2">Órarend</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/class/students" className="flex items-center">
                <GraduationCap />
                <span className="ml-2">Tanulók</span>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Iskolai nyilvántartás</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/school/timetables" className="flex items-center">
                <Calendar />
                <span className="ml-2">Órarendek</span>
                {loading ? null : !hasStudents && <TriangleAlert className="ml-auto text-red-500" />}
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/school/students" className="flex items-center">
                <GraduationCap />
                <span className="ml-2">Tanulók</span>
                {loading ? null : !hasStudents && <TriangleAlert className="ml-auto text-red-500" />}
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard/school/employees" className="flex items-center">
                <BriefcaseBusiness />
                <span className="ml-2">Munkatársak</span>
                {loading ? null : !hasStudents && <TriangleAlert className="ml-auto text-red-500" />}
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Beállítások és naplózás</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard/school/settings" className="flex items-center">
                <SlidersHorizontal />
                <span className="ml-2">Tanév beállításai</span>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
            <SidebarMenuButton asChild>
            <>
              <Link href="/dashboard/school/logs">
                <FileClock />
                <span>Eseménynapló</span>
              </Link>
              </>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <span className="text-xs text-center">powered by teLock</span>
      </SidebarFooter>
    </Sidebar>
  );
}

