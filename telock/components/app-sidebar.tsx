"use client"


import * as React from "react"
import {



  Settings,

  ChevronDown,

  
  LogOut,



 
} from "lucide-react"



import {
  Sidebar,
 // SidebarTrigger,
 // SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,

  SidebarMenu,
  SidebarMenuButton,
 
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
 // AvatarImage,
} from "@/components/ui/avatar"

import Link from "next/link";
import { useState, useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
 

 
 
  const { isMobile } = useSidebar()
  //const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [isButtonVisible, setButtonVisible] = useState<boolean | null>(null);


  //const [students, setStudents] = useState<any[]>([]);



  useEffect(() => {
    const hasClickedBefore = localStorage.getItem("hasClickedOverlayButton");
    setButtonVisible(hasClickedBefore !== "true");
  }, []);

  // Gomb kattintás kezelése
  /*const handleButtonClick = () => {
    setOverlayVisible(true);
  };*/

  /*const handleConfirmClick = () => {
    setOverlayVisible(false);
    setButtonVisible(false);
    localStorage.setItem("hasClickedOverlayButton", "true");
  };*/

  // Addig ne rendereljük a gombot, amíg nem töltöttük be az adatot
  if (isButtonVisible === null) {
    return null; // Várakozás a localStorage betöltésére
  }

  return (
    // variant="inset"
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
      <DropdownMenuItem asChild>
        <div>
          <Link href="/dashboard/settings">
            <Settings />
            <span>Beállítások</span>
          </Link>
        </div>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuItem>
      <LogOut />
      <span>Kijelentkezés</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

        <Separator/>
      </SidebarHeader>

<SidebarContent>

</SidebarContent>


      <SidebarFooter>
    


      <SidebarMenu className="mt-auto">


      </SidebarMenu>

    
      <span className="text-xs text-center">powered by teLock</span>
      </SidebarFooter>
    </Sidebar>
  )
}
