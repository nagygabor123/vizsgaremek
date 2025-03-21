import { AppSidebar } from "@/components/app-sidebar"
import { signOut, useSession } from "next-auth/react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"


import { User, Phone, UploadCloud, ClipboardList, Megaphone } from "lucide-react";

export default function Page() {
  const { data: session } = useSession();


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/50 backdrop-blur-md">
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

        <div className="p-4 space-y-4">
          {/* Üdvözlés */}
       
          <div className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
          <div className="grid auto-rows-min gap-4 w-full">
              <div className="min-h-[60px] rounded-xl bg-blue-100 flex items-center px-4 w-full box-border overflow-hidden">
                <Megaphone className="text-blue-500" />
                <p className="text-sm truncate ml-3 text-blue-500">
                Üdvözöljük a Telock vezérlőpultjában, {session?.user?.full_name}!
                </p>
               
              </div>
          
          </div>
        </div>
      

          {/* Statisztikák */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <Card className="shadow-md border">
                  <CardHeader className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">sdf</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">sdf</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border">
                  <CardHeader className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">sdf</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">sdf</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border">
                  <CardHeader className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">sdf</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">sdf</p>
                  </CardContent>
                </Card>
         
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
    
  )
}
