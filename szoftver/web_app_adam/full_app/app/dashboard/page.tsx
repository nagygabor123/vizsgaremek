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
            


     
  
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 overflow-x-hidden w-full">
  <div className="grid auto-rows-min gap-4 w-full">
    {/* Warning Message */}
    <div className="aspect-[17/1] rounded-xl bg-yellow-50 flex items-center justify-between px-4 w-full box-border overflow-hidden">
      <p className="text-sm font-semibold text-gray-800 truncate">
        Ez egy figyelmeztető üzenet. Kérjük, figyelmesen olvassa el!
      </p>
      <button className="px-3 py-1 text-sm font-semibold text-yellow-900 bg-yellow-300 rounded hover:bg-yellow-400">
        Akció
      </button>
    </div>

    {/* Nagy széles elem */}
    <div className="aspect-[2/1] rounded-xl bg-muted/50 flex items-center justify-center w-full overflow-hidden">
      <p className="text-center text-lg font-bold text-gray-800">
        Ez egy nagy széles elem tartalma.
      </p>
    </div>
  </div>
</div>





      </SidebarInset>
    </SidebarProvider>
    
  )
}
