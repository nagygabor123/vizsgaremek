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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"


import { User, Phone, UploadCloud, ClipboardList } from "lucide-react";

export default function Page() {

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

        <div className="p-6 space-y-6">
          {/* Üdvözlés */}
       
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Üdvözöllek a telefontároló rendszerben!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90">
                  Itt kezelheted a diákok telefonjainak tárolását és visszaadását.
                </p>
              </CardContent>
            </Card>
      

          {/* Statisztikák */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Tárolt telefonok", value: 23, icon: Phone },
              { label: "Mai visszaadások", value: 12, icon: UploadCloud },
              { label: "Heti összes", value: 78, icon: ClipboardList },
            ].map((stat, index) => (
        
                <Card className="shadow-md border">
                  <CardHeader className="flex items-center gap-2">
                    <stat.icon className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{stat.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              
            ))}
          </div>

          {/* Gyakori műveletek */}
      
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Gyakori műveletek</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Új telefon tárolása
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" /> Telefon visszaadása
                </Button>
              </CardContent>
            </Card>
         
        </div>
      </SidebarInset>
    </SidebarProvider>
    
  )
}
