'use client'

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


// Sidebar elemek típusa
interface SidebarItem {
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  allowedPositions: string[];
}

// Sidebar csoportok típusa
interface SidebarGroupConfig {
  groupLabel?: string; // Csoport cím (opcionális)
  items: SidebarItem[]; // A csoporthoz tartozó menüelemek
}

// Sidebar konfiguráció
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
    groupLabel: "Osztályom", // Csoport cím
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
    groupLabel: "Iskolai nyilvántartás", // Csoport cím
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
    groupLabel: "Beállítások és naplózás", // Csoport cím
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
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students/read");
      const data = await response.json();
      setHasStudents(data.length > 0);
    } catch (error) {
      console.error("Error fetching students", error);
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
    <Sidebar {...props}>
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
              <Avatar className="h-9 w-9 rounded-full border border-blue-600">
                <AvatarFallback className="text-blue-600 text-[0.625rem]">
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
                <Avatar className="h-9 w-9 rounded-full border border-blue-600">
                  <AvatarFallback className="text-blue-600 text-[0.625rem]">
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
  <Link href="/settings">
    <LockKeyhole className="text-gray-800"/>
    Jelszó módosítása
  </Link>
</DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="text-gray-800"/>
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

      <SidebarContent>
        {sidebarConfig.map((group: SidebarGroupConfig, groupIndex: number) => {
          // Ellenőrizzük, hogy a csoportban van-e látható menüelem
          const hasVisibleItems = group.items.some((item) => {
            // Ha a csoport cím "Osztályom", akkor a session?.user?.osztalyfonok értékét figyeljük
            if (group.groupLabel === "Osztályom") {
              return session?.user?.osztalyfonok !== "nincs";
            }
            // Egyéb esetben a position alapján ellenőrizzük
            return item.allowedPositions.includes(session?.user?.position || "");
          });

          // Ha nincs látható menüelem, akkor kihagyjuk a csoportot
          if (!hasVisibleItems) return null;

          return (
            <SidebarGroup key={groupIndex}>
              {/* Csoport cím renderelése (ha van) */}
              {group.groupLabel && <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>}

              {/* Menüelemek renderelése */}
              <SidebarMenu>
                {group.items.map((item: SidebarItem) => {
                  // Ha a csoport cím "Osztályom", akkor a session?.user?.osztalyfonok értékét figyeljük
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
                    // Egyéb esetben a position alapján ellenőrizzük
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
    </Sidebar>
  );
}