import Image from "next/image";
import Link from "next/link"
import { FileClock, Zap, ChartColumnBig, ShieldCheck, RefreshCw, Server } from "lucide-react";
import { getServerSession } from "next-auth";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col items-center p-6">

      <header className="w-full max-w-6xl flex flex-wrap justify-between items-center py-6 px-4">
        <span className={`${ZenDots.className} text-3xl text-blue-600`}>
          telock
        </span>
        <nav className="hidden md:flex space-x-6 text-muted-foreground">
          <Link href="#miert" className="hover:text-blue-600 transition">Miért mi?</Link>
          <Link href="#funkciok" className="hover:text-blue-600 transition">Funkciók</Link>
          <Link href="#dokumentaciok" className="hover:text-blue-600 transition">Dokumentációk</Link>
        </nav>

        {session ? (
          <Button variant="outline" className="px-4 py-2" asChild>
            <Link href="/dashboard">Vezérlőpult</Link>
          </Button>
        ) : (
          <Button variant="outline" className="px-4 py-2" asChild>
            <Link href="/login">Bejelentkezés</Link>
          </Button>
        )}
      </header>

      <section className="w-full max-w-6xl text-center my-12 px-4">
        <h2 className="text-4xl md:text-7xl font-bold text-blue-700">
          Biztonságos és kényelmes <span className="text-blue-500">telefontárolás</span> iskoláknak
        </h2>
        <p className="mt-4 text-gray-700 max-w-2xl mx-auto text-base md:text-lg">
          Telefontároló rendszerünk biztosítja, hogy az iskolák diákjai biztonságosan és kényelmesen tárolhassák mobiltelefonjaikat az oktatási idő alatt, miközben csökkentik a zavaró tényezőket az órákon.
        </p>
      </section>

      <div className="flex items-center justify-center p-6 lg:w-4/5 md:px-28 md:py-12">
        <Image
          src="/desktop.png"
          width={1600}
          height={1200}
          className="hidden md:block rounded-xl border shadow-xl"
          alt="Screenshots of the dashboard project showing desktop version"
        />
        <Image
          src="/mobile.png"
          width={560}
          height={620}
          className="block md:hidden rounded-xl border shadow-xl"
          alt="Screenshot of the dashboard project showing mobile version"
        />
      </div>
    </div>
  );
}
