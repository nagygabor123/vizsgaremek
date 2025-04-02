"use client";

import { AppSidebar } from "@/components/app-sidebar"
import { useSession } from "next-auth/react";

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

import { Megaphone } from "lucide-react";

export default function Page() {
  const { data: session } = useSession();

  return (
    // <SidebarProvider>
    //   <AppSidebar />
    //   <SidebarInset>
    <div>
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

        <div className="flex flex-col gap-4 p-4 overflow-x-hidden w-full">
          <div className="grid auto-rows-min gap-4 w-full">
            <div className="min-h-[60px] rounded-xl bg-blue-50 flex items-center px-4 w-full box-border overflow-hidden">
              <Megaphone className="text-blue-600" />
              <p className="text-sm truncate ml-3 text-blue-600">
                Üdvözöljük a telock vezérlőpultján, {session?.user?.full_name}!
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-blue-50" />
            <div className="aspect-video rounded-xl bg-blue-50" />
            <div className="aspect-video rounded-xl bg-blue-50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-blue-50 md:min-h-min" />
        </div>
      {/* </SidebarInset>
    </SidebarProvider> */}
  </div>
  )
}
