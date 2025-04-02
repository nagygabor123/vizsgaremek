"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LogOut,
  House,
  CalendarHeart,
  GraduationCap,
  BriefcaseBusiness,
  LockKeyhole,
  ChevronDown
} from "lucide-react";

interface SidebarItem {
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  allowedPositions: string[];
}

interface SidebarGroupConfig {
  groupLabel?: string;
  items: SidebarItem[];
}

const sidebarConfig: SidebarGroupConfig[] = [
  // Sidebar konfiguráció itt marad
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isActive = (path: string) => pathname === path;

  const { isMobile } = useSidebar();
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
  const [hasStudents, setHasStudents] = useState<boolean | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchStudents();
      fetchSchool();
    }
  }, [session]);  // Frissíti a kérését, amikor a session változik

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students/read");
      const data = await response.json();
      setHasStudents(data.length > 0);
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };

  const fetchSchool = async () => {
    try {
      if (session?.user?.school_id) {
        const response = await fetch(`/api/system/getSchool?school_id=${session.user.school_id}`);
        const data = await response.json();

        if (data.school_name) {
          setSchoolName(data.school_name);
        } else {
          console.error("Iskola neve nem található");
        }
      }
    } catch (error) {
      console.error("Error fetching school", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Not authenticated</div>;
  }

  if (isButtonVisible === null) {
    return null;
  }

  return (
    <Sidebar {...props}>
      <div className="flex flex-col h-full">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-100 border-t-blue-600"></div>
          </div>
        ) : (
          <>
            <SidebarHeader>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="text-s break-words">{schoolName}</span>
                    </div>

                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarFallback className="bg-blue-100 font-semibold text-blue-600 text-[0.625rem]">
                        {session?.user?.short_name}
                      </AvatarFallback>
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
                      <Avatar className="h-10 w-10 rounded-full">
                        <AvatarFallback className="bg-blue-100 font-semibold text-blue-600 text-[0.625rem]">
                          {session?.user?.short_name}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{session?.user?.full_name}</span>
                        <span className="truncate text-xs">{session?.user?.position}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/change-password">
                      <LockKeyhole className="text-gray-800" />
                      Jelszó módosítása
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="text-gray-800" />
                    <span
                      onClick={() => {
                        signOut();
                      }}
                    >
                      Kijelentkezés
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Separator />
            </SidebarHeader>

            <SidebarContent className="flex-grow">
              {sidebarConfig.map((group: SidebarGroupConfig, groupIndex: number) => {
                const hasVisibleItems = group.items.some((item) => {
                  if (group.groupLabel === "Osztályom") {
                    return session?.user?.osztalyfonok !== "nincs";
                  }

                  return item.allowedPositions.includes(session?.user?.position || "");
                });

                if (!hasVisibleItems) return null;

                return (
                  <SidebarGroup key={groupIndex}>
                    {group.groupLabel && <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>}
                    <SidebarMenu>
                      {group.items.map((item: SidebarItem) => {
                        if (group.groupLabel === "Osztályom") {
                          if (session?.user?.osztalyfonok !== "nincs") {
                            return (
                              <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton asChild isActive={isActive(item.path)}>
                                  <Link href={item.path}>
                                    <>
                                      <item.icon />
                                      <span>{item.label}</span>
                                    </>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          }
                        } else {
                          if (item.allowedPositions.includes(session?.user?.position || "")) {
                            return (
                              <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton asChild isActive={isActive(item.path)}>
                                  <Link href={item.path}>
                                    <>
                                      <item.icon />
                                      <span>{item.label}</span>
                                    </>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            );
                          }
                        }
                        return null;
                      })}
                    </SidebarMenu>
                  </SidebarGroup>
                );
              })}
            </SidebarContent>

            <SidebarFooter>
              <Link href="/" className="text-xs text-center">
                © {new Date().getFullYear()} telock
              </Link>
            </SidebarFooter>
          </>
        )}
      </div>
    </Sidebar>
  );
}
