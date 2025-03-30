import Image from "next/image";
import Link from "next/link"
import { FileClock, Zap, ChartColumnBig, ShieldCheck, RefreshCw, Server, Rocket, Cpu, TrendingUp } from "lucide-react";
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
        <h2 className="text-4xl md:text-7xl font-bold text-gray-800">
          Biztonságos és kényelmes telefontárolás iskoláknak
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
          className="hidden md:block rounded-xl border"
          alt="Screenshots of the dashboard project showing desktop version"
        />
        <Image
          src="/mobile.png"
          width={560}
          height={620}
          className="block md:hidden rounded-xl border"
          alt="Screenshot of the dashboard project showing mobile version"
        />
      </div>

      <section id="miert" className="py-6 md:py-8 lg:py-12">
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
      Miért válassz minket?
    </h2>
    <p className="text-sm text-muted-foreground sm:text-lg mb-8">
      Mi innovatív megoldásokkal segítjük az iskolákat, hogy biztosítva legyen a diákok mobiltelefonjainak biztonságos tárolása. Mi nem csupán egy rendszert kínálunk, hanem egy egyszerűen kezelhető és megbízható megoldást, amely hozzájárul a zavartalan oktatás biztosításához.
    </p>
    <div className="flex flex-col sm:flex-row justify-center gap-6">
      <div className="w-full max-w-xs bg-white shadow-lg p-6 rounded-lg text-left">
        <h3 className="text-xl font-semibold mb-4">Innováció és megbízhatóság</h3>
        <p className="text-sm text-muted-foreground mb-6">
          A legmodernebb technológia alkalmazásával biztosítjuk a diákok eszközeinek védelmét és a rendszer zökkenőmentes működését.
        </p>
      </div>
      <div className="w-full max-w-xs bg-white shadow-lg p-6 rounded-lg text-left">
        <h3 className="text-xl font-semibold mb-4">Könnyű használhatóság</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Az egyszerű kezelőfelület lehetővé teszi a tanárok és diákok számára is, hogy könnyedén használják a rendszert, csökkentve a tanulási görbét.
        </p>
      </div>
      <div className="w-full max-w-xs bg-white shadow-lg p-6 rounded-lg text-left">
        <h3 className="text-xl font-semibold mb-4">Rugalmasság</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Rendszerünk könnyedén alkalmazkodik a különböző iskolai igényekhez, legyen szó több tárolóhelyről vagy egyedi beállítások kezeléséről.
        </p>
      </div>
    </div>
  </div>
</section>


      <section id="funkciok" className="w-full max-w-6xl text-center my-12 px-4">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Funkciók</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[{
            title: 'Biztonságos tárolás',
            description: 'A diákok telefonjai zárt fiókokban kerülnek tárolásra.',
            icon: <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto" />
          }, {
            title: 'Gyors kiadás és visszavétel',
            description: 'RFID segítségével gyorsan kiadható és visszavehető a készülék.',
            icon: <Zap className="w-12 h-12 text-blue-600 mx-auto" />
          }, {
            title: 'Események naplózása',
            description: 'A rendszer naplózza a telefonok leadását és kivételét.',
            icon: <FileClock className="w-12 h-12 text-blue-600 mx-auto" />
          }, {
            title: 'Adminisztrátori felügyelet',
            description: 'Az iskola vezetősége valós időben ellenőrizheti a fiókok állapotát.',
            icon: <ChartColumnBig className="w-12 h-12 text-blue-600 mx-auto" />
          }, {
            title: 'Szoftverfrissítések',
            description: 'A rendszer mindig a legújabb funkciókat és biztonsági javításokat tartalmazza.',
            icon: <RefreshCw className="w-12 h-12 text-blue-600 mx-auto" />
          }, {
            title: 'Több tárolóhely támogatása',
            description: 'Több tárolószekrény telepítse az iskola különböző pontjaira.',
            icon: <Server className="w-12 h-12 text-blue-600 mx-auto" />
          }].map((feature, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 transition-transform hover:scale-105">
              {feature.icon}
              <h3 className="font-bold mt-4">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="dokumentaciok" className="py-6 md:py-8 lg:py-12">
  <div className="container mx-auto text-center">
    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
      Dokumentációk
    </h2>
    <p className="text-sm text-muted-foreground sm:text-lg mb-8">
      Minden, amire szükséged van a rendszer hatékony használatához.
    </p>
    <div className="flex justify-center gap-6">
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">API dokumentáció</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Fedezd fel az API használatát és az integrációk lehetőségeit.
        </p>
        <Button asChild className="w-full">
          <Link href="/api-docs" className="text-blue-600 hover:text-blue-800">Megnyitás</Link>
        </Button>
      </div>
      <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Szoftver dokumentáció</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Részletes útmutatók és telepítési információk a szoftverhez.
        </p>
        <Button asChild className="w-full">
          <Link href="#" className="text-blue-600 hover:text-blue-800">Megnyitás</Link>
        </Button>
      </div>
    </div>
  </div>
</section>


    </div>
  );
}
