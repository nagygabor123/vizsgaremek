"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

import { AppSidebar } from "@/components/app-sidebar"
import { Slash

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
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,


} from "@/components/ui/sidebar"

import Link from "next/link";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ChevronLeft, AlertCircle, CircleCheck  } from "lucide-react";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function ChangePassword() {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    if (!session?.user?.password) {
      setMessage("Hiba: nincs bejelentkezett felhasználó.");
      return;
    }

    const res = await fetch("https://vizsgaremek-mocha.vercel.app/api/config/changePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (








<div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-zinc-50 p-6 md:p-10">



  {/*

      <div className="p-4">
      <input
        type="password"
        placeholder="Régi jelszó"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Új jelszó"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Jelszó módosítása</button>
      {message && <p>{message}</p>}
    </div>

 */}


<div className="flex w-full max-w-sm flex-col gap-6">
  <a href="/" className="flex items-center gap-2 self-center font-medium">
   {/* <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <GalleryVerticalEnd className="size-4" />
    </div>
    
    <span className={`${ZenDots.className} text-xl`}>
                telock
              </span>*/}
   
  </a>
  <div className="flex flex-col gap-6">
<Button variant="ghost" className="absolute left-4 top-4 p-2" asChild>

<Link href="/">

<ChevronLeft /> Vissza

</Link>
</Button>
<Card>
<CardHeader className="text-center">
  <CardTitle className="text-xl">Üdv újra itt!</CardTitle>
  <CardDescription>
  Jelentkezzen be a fiókjába a felhasználónevének és jelszavának megadásával
  </CardDescription>
</CardHeader>
<CardContent>
  <form > {/*onSubmit={handleSubmit} */}
    <div className="grid gap-6">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="short_name">Felhasználónév</Label>
          <Input
            name="short_name"
            type="text"
            placeholder="TeEl"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Jelszó</Label>
           {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Elfelejtette jelszavát? 
            </a>*/}
          </div>
          <Input name="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Bejelentkezés
        </Button>

      {/*  {error && 
        <Alert variant="destructive">
<AlertCircle className="h-4 w-4" />
<AlertTitle>Sikeretlen bejelentkezés</AlertTitle>
<AlertDescription>
{error}
</AlertDescription>
</Alert>}
        {success && 
        
        <Alert variant="siker">
<CircleCheck className="h-4 w-4" />
<AlertTitle>Sikeres bejelentkezés</AlertTitle>
<AlertDescription>
Nem sokára átirányítunk a vezérlőpultra.
</AlertDescription>
</Alert>
        
        }*/}
      </div>
     
    </div>
  </form>
</CardContent>
</Card>
<div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
Az adatait biztonságban tartjuk, és kizárólag azonosításra használjuk.
</div>
</div>
</div>
</div>










   
  );
}
