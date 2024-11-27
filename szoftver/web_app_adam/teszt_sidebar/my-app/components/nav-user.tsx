"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  ChevronUp
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  return (
    // <SidebarMenu>
    //   <SidebarMenuItem>
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <SidebarMenuButton
    //           size="lg"
    //           className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
    //         >
    //           <Avatar className="h-8 w-8 rounded-lg">
    //             <AvatarImage src={user.avatar} alt={user.name} />
    //             <AvatarFallback className="rounded-lg">CN</AvatarFallback>
    //           </Avatar>
    //           <div className="grid flex-1 text-left text-sm leading-tight">
    //             <span className="truncate font-semibold">{user.name}</span>
    //             <span className="truncate text-xs">{user.email}</span>
    //           </div>
    //           <ChevronsUpDown className="ml-auto size-4" />
    //         </SidebarMenuButton>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent
    //         className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
    //         side={isMobile ? "bottom" : "right"}
    //         align="end"
    //         sideOffset={4}
    //       >
    //         <DropdownMenuLabel className="p-0 font-normal">
    //           <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
    //             <Avatar className="h-8 w-8 rounded-lg">
    //               <AvatarImage src={user.avatar} alt={user.name} />
    //               <AvatarFallback className="rounded-lg">CN</AvatarFallback>
    //             </Avatar>
    //             <div className="grid flex-1 text-left text-sm leading-tight">
    //               <span className="truncate font-semibold">{user.name}</span>
    //               <span className="truncate text-xs">{user.email}</span>
    //             </div>
    //           </div>
    //         </DropdownMenuLabel>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuGroup>
    //           <DropdownMenuItem>
    //             <Sparkles />
    //             Upgrade to Pro
    //           </DropdownMenuItem>
    //         </DropdownMenuGroup>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuGroup>
    //           <DropdownMenuItem>
    //             <BadgeCheck />
    //             Account
    //           </DropdownMenuItem>
    //           <DropdownMenuItem>
    //             <CreditCard />
    //             Billing
    //           </DropdownMenuItem>
    //           <DropdownMenuItem>
    //             <Bell />
    //             Notifications
    //           </DropdownMenuItem>
    //         </DropdownMenuGroup>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem>
    //           <LogOut />
    //           Log out
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   </SidebarMenuItem>
    // </SidebarMenu>
    <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
              
              <div className="grid flex-1 text-left text-sm leading-tight">
               <span className="truncate font-semibold">{user.name}</span>
               <span className="truncate text-xs">{user.email}</span>
             </div>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
  )
}
