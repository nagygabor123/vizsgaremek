import { useEffect } from "react";
import { Separator } from "@/components/ui/separator"
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { FileClock, Zap, ChartColumnBig, ShieldCheck, RefreshCw, Server } from "lucide-react";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"
import localFont from "next/font/local";



const ZenDots = localFont({
  src: "./fonts/ZenDots-Regular.ttf",
  variable: "--font-zen-dots",
  weight: "100 900",
});



export default async function Home() {
  const session = await getServerSession();
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center p-6">
      
      <header className="w-full max-w-6xl flex flex-wrap justify-between items-center py-6 px-4">
        <span className={`${ZenDots.className} text-xl`}>
          telock
        </span>
        <nav className="hidden md:flex space-x-6 text-muted-foreground">
          <Link href="#miert">Miért mi?</Link>
          <Link href="#funkciok">Funkciók</Link>
          <Link href="#dokumentaciok">Dokumentációk</Link>
        </nav>

        {!!session &&
          <>
            <Button variant="outline" className="px-4 py-2" asChild>
              <Link href="/dashboard">Vezérlőpult</Link>
            </Button>
           
          </>
        }

        {!session &&

          <Button variant="outline" className="px-4 py-2" asChild>
            <Link href="/login">Bejelentkezés</Link>
          </Button>
        }
      </header>

      <section className="w-full max-w-6xl text-center my-12 px-4">
        <h2 className="text-3xl md:text-6xl font-bold">Biztonságos és kényelmes <span className="text-blue-600">telefontárolás</span> iskoláknak</h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
          elefontároló rendszerünk biztosítja, hogy az iskolák diákjai biztonságosan és kényelmesen tárolhassák mobiltelefonjaikat az oktatási időszak alatt, miközben csökkentik a zavaró tényezőket az órákon.
        </p>
        <Button className="mt-6">Kapcsolatfelvétel</Button>
      </section>


      <div className="w-full max-w-5xl bg-gradient-to-r from-blue-600 to-white p-4 md:p-8 rounded-xl shadow">
        <Image src="/example.png" alt="Illustration" width={800} height={400} className="w-full h-auto rounded-xl" priority /> {/*width={800} height={400} */}

      </div>

   


      <section id="miert" className="space-y-2 py-4 md:py-6 lg:py-8 mt-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-2xl font-bold leading-[1.1] sm:text-2xl md:text-4xl"> Miért mi? </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground text-sm md:text-base"> Mert innovatív megoldásainkkal biztosítjuk a diákok számára a biztonságos és kényelmes telefontárolást, miközben segítjük az iskolákat a modern kihívások kezelésében. Rendszerünk egyszerűen kezelhető, megbízható, és hozzájárul a zavartalan oktatási folyamatokhoz. Válasszon minket, ha hatékony és diákbarát megoldásra vágyik!
          </p>
        </div>
      </section>
    


      <section
        id="funkciok"
        className="space-y-2 py-4 md:py-6 lg:py-8"
      >
          
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-2xl font-bold leading-[1.1] sm:text-2xl md:text-4xl">
            Funkciók
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground text-sm md:text-base">
            Itt megismerheti a rendszer főbb funkcióit, amelyek biztosítják a telefonok biztonságos tárolását és kezelését az iskolákban.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <ShieldCheck className="w-12 h-12 text-blue-600" />
              <div className="space-y-2">
                <h3 className="font-bold">Biztonságos tárolás</h3>
                <p className="text-sm text-muted-foreground">
                  A diákok telefonjai zárt fiókokban kerülnek tárolásra.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Zap className="w-12 h-12 text-blue-600" />
              <div className="space-y-2">
                <h3 className="font-bold">Gyors kiadás és visszavétel</h3>
                <p className="text-sm text-muted-foreground">
                  RFID segítségével gyorsan kiadható és visszavehető a készülék.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <FileClock className="w-12 h-12 text-blue-600" />
              <div className="space-y-2">
                <h3 className="font-bold">Események naplózása</h3>
                <p className="text-sm text-muted-foreground">
                  A rendszer naplózza a telefonok leadását és kivételét.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <ChartColumnBig className="w-12 h-12 text-blue-600" />
              <div className="space-y-2">
                <h3 className="font-bold">Adminisztrátori felügyelet</h3>
                <p className="text-sm text-muted-foreground">
                  Az iskola vezetése valós időben ellenőrizheti a fiókok állapotát.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <RefreshCw className="w-12 h-12 text-blue-600" />
              <div className="space-y-2">
                <h3 className="font-bold">Szoftverfrissítések</h3>
                <p className="text-sm text-muted-foreground">
                  A rendszer mindig a legújabb funkciókat és biztonsági javításokat biztosítsa.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Server className="w-12 h-12 text-blue-600" />
              <div className="space-y-2">
                <h3 className="font-bold">Több tárolóhely támogatása</h3>
                <p className="text-sm text-muted-foreground">
                  Lehetőség van arra, hogy több fiókot telepítsenek az iskola különböző pontjaira.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
     

      <section
        id="dokumentaciok"
        className="space-y-2 py-4 md:py-6 lg:py-8"
      >
         
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-2xl font-bold leading-[1.1] sm:text-2xl md:text-4xl">
            Dokumentációk
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground text-sm md:text-base">
            Minden, amire szüksége van a rendszer hatékony használatához. A felhasználói dokumenctáció segít a könnyű navigálásban, míg a fejlesztői technikai leírásokat tartalmaz.
          </p>
          <div className="flex gap-4 mt-3">
            <Button className="">
              Fejlesztői dokumentáció
            </Button>
            <Button className="">
              Felhasználói dokumentáció
            </Button>
          </div>
        </div>
        
      </section>
     

      <footer>
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Az oldal vizsgaprojektként készült, fejlesztését Nagy Gábor és Szalkai-Szabó Ádám végezték.
          </p>
          <p className="text-sm md:text-right">© 2025</p>
        </div>
      </footer>
    </div>
  );
}
