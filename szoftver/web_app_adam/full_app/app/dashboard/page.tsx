import { AppSidebar } from "@/components/app-sidebar"
import {
   ChevronDown,

} from "lucide-react"


import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupLabel,
  useSidebar,

} from "@/components/ui/sidebar"


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


export default function Page() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    Project Management & Task Tracking
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            {/* <NavActions /> */}
            

<DropdownMenu>
<DropdownMenuTrigger asChild>
  <SidebarMenuButton
    size="lg"
    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
  >
  
  <Avatar className="h-7 w-7 rounded-lg">
      <AvatarFallback className="rounded-lg bg-orange-400">VZ</AvatarFallback>
    </Avatar>
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">Vincze Zsolt</span>

      <span className="truncate text-xs">vincze.zsolt@szbi-pg.hu</span>
      </div>
   
    <ChevronDown className="ml-auto size-4" />
  </SidebarMenuButton>
</DropdownMenuTrigger>
<DropdownMenuContent>
  <DropdownMenuLabel className="p-0 font-normal">
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-9 w-9 rounded-lg">
        <AvatarFallback className="rounded-lg bg-orange-400">VZ</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-semibold">Vincze Zsolt</span>
        <span className="truncate text-xs">vincze.zsolt@szbi-pg.hu</span>
      </div>
    </div>
  </DropdownMenuLabel>
  <DropdownMenuSeparator />
  {/* <DropdownMenuGroup>
    <DropdownMenuItem>
      <Sparkles />
      Upgrade to Pro
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator /> */}
  {/* <DropdownMenuGroup>

    <DropdownMenuItem>
      <Settings />
      Beállítások
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator /> */}
  <DropdownMenuItem>
    {/* <LogOut /> */}
    Kijelentkezés
  </DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
     
  
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        
        </div>

      </SidebarInset>
    </SidebarProvider>
    
  )
}
