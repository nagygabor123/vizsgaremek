'use client'

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import * as React from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  GraduationCap,
  BriefcaseBusiness,
  LogOut,
  CalendarHeart,
  Calendar,
  House,
  LockKeyhole
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
  {
    items: [
      {
        label: "Kezdőlap",
        icon: House,
        path: "/dashboard",
        allowedPositions: ["Tanár", "igazgato", "igazgatohelyettes", "rendszergazda", "portas"],
      },
      {
        label: "Saját órák",
        icon: CalendarHeart,
        path: "/dashboard/my-timetable",
        allowedPositions: ["Tanár", "igazgato", "igazgatohelyettes"],
      },
    ],
  },
  {
    groupLabel: "Osztályom",
    items: [
      {
        label: "Órarend",
        icon: Calendar,
        path: "/dashboard/class/timetable",
        allowedPositions: [],
      },
      {
        label: "Tanulók",
        icon: GraduationCap,
        path: "/dashboard/class/students",
        allowedPositions: [],
      },
    ],
  },
  {
    groupLabel: "Iskolai nyilvántartás",
    items: [
      {
        label: "Órarendek",
        icon: Calendar,
        path: "/dashboard/school/timetables",
        allowedPositions: ["igazgato", "igazgatohelyettes", "rendszergazda"],
      },
      {
        label: "Tanulók",
        icon: GraduationCap,
        path: "/dashboard/school/students",
        allowedPositions: ["igazgato", "igazgatohelyettes", "rendszergazda", "portas"],
      },
      {
        label: "Munkatársak",
        icon: BriefcaseBusiness,
        path: "/dashboard/school/employees",
        allowedPositions: ["igazgato", "igazgatohelyettes", "rendszergazda"],
      },
    ],
  },
  {
    groupLabel: "Beállítások és naplózás",
    items: [
      {
        label: "Tanév beállításai",
        icon: SlidersHorizontal,
        path: "/dashboard/school/settings",
        allowedPositions: ["igazgato", "igazgatohelyettes", "rendszergazda"],
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isActive = (path: string) => pathname === path;

  const { isMobile } = useSidebar();
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);
  const [hasStudents, setHasStudents] = useState<boolean | null>(null);
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students/read");
      const data = await response.json();
      setHasStudents(data.length > 0);
    } catch (error) {
      console.error("Error fetching students", error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  const fetchSchool = async () => {
    try {
      const response = await fetch(`/api/system/getSchool?school_id=${session?.user?.school_id}`);
      const data = await response.json();

      if (data.school_name) {
        setSchoolName(data.school_name);
      } else {
        console.error("Iskola neve nem található");
      }
    } catch (error) {
      console.error("Error fetching school", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStudents();
    fetchSchool();
  }, []);

  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

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