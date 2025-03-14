import { AppSidebar } from "@/components/app-sidebar"


import {
  Breadcrumb,
  BreadcrumbItem,

  BreadcrumbList,
  BreadcrumbPage,

} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
 
  SidebarTrigger,
  SidebarInset,
 
  SidebarProvider,
 

} from "@/components/ui/sidebar"





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
      <BreadcrumbPage>Kezdőlap</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
          </div>
        </header>

        <div className="p-4">
        </div>



      </SidebarInset>
    </SidebarProvider>
    
  )
}
