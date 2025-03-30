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
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col items-center">
      {/* Hero Section with overlapping space */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 pb-32 md:pb-48 relative z-0">
        <div className="max-w-7xl mx-auto px-6 pt-16">
          <header className="w-full flex justify-between items-center mb-16">
            <span className={`${ZenDots.className} text-3xl text-white`}>
              telock
            </span>
            <nav className="hidden md:flex space-x-8 text-white">
              <Link href="#miert" className="hover:text-blue-200 transition">Miért mi?</Link>
              <Link href="#funkciok" className="hover:text-blue-200 transition">Funkciók</Link>
              <Link href="#dokumentaciok" className="hover:text-blue-200 transition">Dokumentációk</Link>
            </nav>

            {session ? (
              <Button variant="secondary" asChild>
                <Link href="/dashboard">Vezérlőpult</Link>
              </Button>
            ) : (
              <Button variant="secondary" asChild>
                <Link href="/login">Bejelentkezés</Link>
              </Button>
            )}
          </header>

          <section className="w-full text-center my-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
              Biztonságos és kényelmes <br /> telefontárolos iskoláknak
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
              Innovatív megoldásunk segít fenntartani a koncentrációt az órákon, miközben biztosítja diák eszközeinek védelmét.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button asChild>
                <Link href="mailto:nagy.gabor@diak.szbi-pg.hu,szalkai-szabo.adam@diak.szbi-pg.hu?subject=Kapcsolatfelvétel">Írjon nekünk</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="#funkciok">Funkciók</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>


      {/* Product Showcase - Overlapping with responsive images */}
      <div className="w-full max-w-7xl px-6 -mt-24 md:-mt-40 relative z-10">
        <div className="bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-200">
          {/* Desktop version */}
          <Image
            src="/desktop.png"
            width={1600}
            height={1200}
            className="hidden md:block w-full h-auto rounded-sm shadow-lg drop-shadow-lg shadow-blue-500/50"
            alt="Telock irányítópult asztali verzió"
            priority
          />

          {/* Mobile version */}
          <Image
            src="/mobile.png"
            width={560}
            height={620}
            className="block md:hidden w-full h-auto rounded-sm shadow-lg drop-shadow-lg shadow-blue-500/50"
            alt="Telock irányítópult mobil verzió"
            priority
          />
        </div>
      </div>


      {/* Why Choose Us */}
      <section id="miert" className="w-full py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Miért mi?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Különleges megoldásaink egyedivé teszik rendszerünket az iskolai telefontárolás területén.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className=" p-8 rounded-xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Magas szintű biztonság</h3>
              <p className="text-gray-600">
                Titkosított tárolóegységeink és auditált hozzáférési rendszerünk garantálja eszközeitek biztonságát.
              </p>
            </div>

            <div className="b p-8 rounded-xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Tanulmányi eredmények javulása</h3>
              <p className="text-gray-600">
                Partneriskoláinknál 42%-kal csökkent a figyelemzavar, 27%-kal javultak az átlagok.
              </p>
            </div>

            <div className=" p-8 rounded-xl hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Cpu className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Okos integrációk</h3>
              <p className="text-gray-600">
                Kompatibilis az iskolai rendszerekkel, naplóprogramokkal és adminisztrációs szoftverekkel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="w-full py-16 bg-gradient-to-r from-blue-700 to-blue-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Készen áll az iskolája digitális átalakulására?
          </h2>
          <p className="text-xl text-blue-100 mb-8 text-white">
            Vegye fel velünk a kapcsolatot még ma, és kérjen egy személyre szabott bemutatót!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild>
              <Link href="#contact">Bemutató kérése</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="tel:+3612345678">Hívjon minket</Link>
            </Button>
          </div>
        </div>
      </section> */}

<section className="w-full py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Iskolák véleménye
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Csatlakozzon több mint 120 elégedett oktatási intézményhez.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "A Telock rendszer bevezetése óta drasztikusan csökkent a mobiltelefonok miatti fegyelmi incidensek száma iskolánkban.",
                author: "Kovács János, igazgató",
                school: "Budapesti Széchenyi Gimnázium"
              },
              {
                quote: "Végre egy olyan megoldás, ami tényleg működik és nem csak terhet ró a tanárainkra. A diákjaink is könnyen megtanulták használni.",
                author: "Nagy Edit, iskolavezető",
                school: "Debreceni Református Kollégium"
              },
              {
                quote: "Technikai támogatásuk kiváló, minden kérdésünkre gyorsan és szakmailag megalapozottan válaszolnak.",
                author: "Tóth Béla, Rendszergazda",
                school: "Pécsi Műszaki Szakközépiskola"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
                <p className="italic mb-6 text-lg">"{testimonial.quote}"</p>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-blue-200">{testimonial.school}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="funkciok" className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funkciók
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Minden, amire egy modern iskolának szüksége lehet a hatékony telefontároláshoz.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'RFID azonosítás',
                description: 'Diákigazolványokkal kompatibilis gyors azonosítás és kiszolgálás.',
                icon: <Zap className="w-6 h-6 text-blue-600" />
              },
              {
                title: 'Valós idejű nyomonkövetés',
                description: 'Minden eszköz mozgása nyomon követhető az admin felületen.',
                icon: <ChartColumnBig className="w-6 h-6 text-blue-600" />
              },
              {
                title: 'Többfaktoros hitelesítés',
                description: 'Tanári hozzáférés PIN kód és biometrikus adatok kombinációjával.',
                icon: <ShieldCheck className="w-6 h-6 text-blue-600" />
              },
              {
                title: 'Automatikus frissítések',
                description: 'Rendszerünk mindig naprakész a legújabb biztonsági javításokkal.',
                icon: <RefreshCw className="w-6 h-6 text-blue-600" />
              },
              {
                title: 'Skálázható architektúra',
                description: 'Akár 1000+ diák számára is biztosítunk megbízható megoldást.',
                icon: <Server className="w-6 h-6 text-blue-600" />
              },
              {
                title: 'Részletes jelentéskészítés',
                description: 'Testreszabható jelentések a használati szokásokról és trendekről.',
                icon: <FileClock className="w-6 h-6 text-blue-600" />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section id="dokumentaciok" className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dokumentáció és Támogatás
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Minden erőforrás, amire szüksége van a rendszer hatékony használatához.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all">
              <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <FileClock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Projekt Dokumentáció</h3>
              <p className="text-gray-600 mb-6">
                Egyetlen PDF dokumentumban megtalálható a felhasználói és fejlesztői dokumentáció, amely segít a rendszer használatában, telepítésében és karbantartásában.
              </p>
              <Button variant="outline" asChild>
                <Link href="#">Letöltés PDF</Link>
              </Button>
            </div>

            <div className="border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all">
              <div className="bg-blue-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">API Dokumentáció</h3>
              <p className="text-gray-600 mb-6">
                Az API dokumentációban látható az összes végpont, illetve teszteesetek is olvashatóak.
              </p>
              <Button variant="outline" asChild>
                <Link href="/api-docs">Megnyitás</Link>
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      <footer className="w-full text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className={`${ZenDots.className} text-2xl mb-4`}>telock</h3>
              <p className="text-gray-400">
                Innovatív megoldások a modern oktatás támogatására.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Linkek</h4>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition">Vezérlőpult</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Dokumentáció</Link></li>
                <li><Link href="/api-docs" className="text-gray-400 hover:text-white transition">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kapcsolat</h4>
              <ul className="space-y-2 text-gray-400">
                <li>nagy.gabor@diak.szbi-pg.hu</li>
                <li>szalkai-szabo.adam@diak.szbi-pg.hu</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kövessen minket</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition">Instagram</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition">TikTok</Link>
                <Link href="#" className="text-gray-400 hover:text-white transition">YouTube</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} telock. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}