"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  FileText,
  LifeBuoy,
  Map,
  ShieldHalf,
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
  UserCog,
  SquarePen,
  MessageCircleQuestion,
  CircleUser,
  CalendarCog,
  Backpack,
  GraduationCap,
  BookType,
  CalendarSync,
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


import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
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


const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar()


  return (
    // variant="inset"
    <Sidebar  className="border-r-0" {...props}>
      <SidebarHeader>
      <SidebarMenu>
          <SidebarMenuItem>
{/* 
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="rounded-lg bg-white">
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-blue-300  text-sidebar-primary-foreground">
                  <School className="size-4" />
                </div> 
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Kiskunfélegyházi Szent Benedek PG</span>
                  <span className="truncate text-xs">Két Tanítási Nyelvű Technikum és Kollégium</span>
                </div>
              </Link>
            </SidebarMenuButton> */}
               <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
       <Avatar className="h-9 w-9 rounded-lg ">
              
                <AvatarFallback className="rounded-lg bg-lime-300">VZ</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Vincze Zsolt</span>
                <span className="truncate text-xs">vincze.zsolt@szbi-pg.hu</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
         
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={ isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
              <DropdownMenuLabel>Saját fiók
           {/* <span className="truncate text-xs">itt tanít:</span>    */}
                {/* tanár itt: */}
              {/* <div className="grid flex-1 text-left text-sm leading-tight">
          
                <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <School className="size-3" />
              </div>
                <span className="truncate font-semibold">Kiskunfélegyházi Szent Benedek PG Két Tanítási Nyelvű Technikum és Koll. </span>
              </div> */}

              {/* <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <School className="size-3" />
              </div>
              <span className="truncate font-semibold">Kiskunfélegyházi Szent Benedek PG Két Tanítási Nyelvű Technikum és Koll.</span>
             */}

            
            </DropdownMenuLabel>
            {/* <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
             <CircleUser/>
                Fiók
              </DropdownMenuItem>
        
              <DropdownMenuItem>
             <CircleUser/>
                Beállítások
              </DropdownMenuItem>
    
            </DropdownMenuGroup>
            <DropdownMenuSeparator /> */}

<DropdownMenuSeparator />
            
              <DropdownMenuItem>
           
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <School className="size-3" />
              </div>
              <span className="truncate font-semibold">Kiskunfélegyházi Szent Benedek PG Két Tanítási Nyelvű Technikum és Koll.</span>

              </DropdownMenuItem>


              <DropdownMenuSeparator />

            <DropdownMenuItem>
                    <LogOut />
              Kijelentkezés
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>


        <Separator />
      </SidebarHeader>
      <SidebarContent>

      <SidebarGroup>
      <SidebarMenu>
      {/* <SidebarMenuItem>
      <SidebarMenuButton asChild>
        
  <Link href="">
  <Home/>
    <span>Konfigurátor</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem> */}


      <SidebarMenuItem>
      <SidebarMenuButton asChild>
        
  <Link href="">
  <CalendarHeart/>
    <span>Tanóráim</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
    
          <SidebarGroup>
          <SidebarGroupLabel>Saját osztály</SidebarGroupLabel>
      <SidebarMenu>
      <SidebarMenuItem>
      <SidebarMenuButton asChild>
  <Link href="r">
  <Calendar/>
    <span>Órarend</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <Users/>
    <span>Tanulók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
 

    <SidebarGroup>
          <SidebarGroupLabel>Iskola</SidebarGroupLabel>
      <SidebarMenu>

      <SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
<CalendarSync/>
    <span>Helyettesítések</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>

      <SidebarMenuItem>
      <SidebarMenuButton asChild>
  <Link href="">
<CalendarSearch/>
    <span>Órarendek</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
<UserSearch/>
    <span>Tanulók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>
<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <BriefcaseBusiness/>
    <span>Alkalmazottak</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
<SlidersHorizontal/>
    <span>Tanév beállításai</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>


<SidebarMenuItem>
<SidebarMenuButton asChild>
  <Link href="">
  <FileClock/>
    <span>Tevékenységi naplók</span>
  </Link>
</SidebarMenuButton>
</SidebarMenuItem>

      </SidebarMenu>
    </SidebarGroup>
 



      </SidebarContent>
      <SidebarFooter>
    


      <SidebarMenu className="mt-auto">
{/* 
      <SidebarMenuItem>
      <SidebarMenuButton asChild size="sm">
        
  <Link href="">
  <Settings/>
    <span>Beállítások</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>  */}

      <SidebarMenuItem>
      <SidebarMenuButton asChild size="sm">
        
  <Link href="">
  <LifeBuoy/>
    <span>Súgóközpont</span>
   {/* <SquareArrowOutUpRight className="ml-auto" />*/}
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>



<SidebarMenuItem>
      <SidebarMenuButton asChild size="sm">
        
  <Link href="">
  <MessageCircleWarning/>
    <span>Probléma jelentése</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem>


{/* <SidebarMenuItem>
      <SidebarMenuButton asChild size="sm">
        
  <Link href="">
  <Settings/>
    <span>Beállítások</span>
    
  </Link>
 
</SidebarMenuButton>
</SidebarMenuItem> */}

      </SidebarMenu>

    

      </SidebarFooter>
    </Sidebar>
  )
}
