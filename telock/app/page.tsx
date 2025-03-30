import Image from "next/image";
import Link from "next/link"
import { FileClock, Zap, ChartColumnBig, ShieldCheck, RefreshCw, Server, ChevronDown, Instagram, Cpu, ArrowRight, Twitter, Youtube, Mail, Newspaper, TrendingUp, CheckCircle, Lock, Navigation, Facebook,  } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">

      <div className="w-full bg-gradient-to-r from-blue-600 to-blue-800 pb-32 md:pb-48 relative z-0">
        <div className="max-w-7xl mx-auto px-6 pt-16">
          <header className="w-full flex justify-between items-center mb-16">
            <span className={`${ZenDots.className} text-3xl text-white`}>
              telock
            </span>
            <nav className="hidden md:flex space-x-8 text-white">
              <Link href="#miert" className="hover:text-blue-200 transition">Miért mi?</Link>
              <Link href="#funkciok" className="hover:text-blue-200 transition">Funkciók</Link>
              <Link href="#velemenyek" className="hover:text-blue-200 transition">Vélemények</Link>
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
<div className="w-full max-w-7xl px-6 mx-auto -mt-24 md:-mt-40 relative z-10 mb-24 md:mb-32"> {/* Increased bottom margin */}
  <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200/50 hover:border-blue-200 transition-all duration-300">
    {/* Desktop version */}
    <Image
      src="/desktop.png"
      width={1600}
      height={1200}
      className="hidden md:block w-full h-auto rounded-lg shadow-xl"
      alt="Telock irányítópult asztali verzió"
      priority
    />
    {/* Mobile version */}
    <Image
      src="/mobile.png"
      width={560}
      height={620}
      className="block md:hidden w-full h-auto rounded-lg shadow-xl"
      alt="Telock irányítópult mobil verzió"
      priority
    />
  </div>
</div>
      <section id="miert" className="w-full pt-8 pb-24 bg-gradient-to-b from-white to-gray-50"> {/* Reduced top padding */}
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full mb-4">
        <span className="text-sm font-medium text-blue-600">Innovatív megoldások</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Miért válassza a <span className="text-blue-600">telock</span> rendszerét?
      </h2>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Különleges megoldásaink egyedivé teszik rendszerünket az iskolai telefontárolás területén.
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          icon: <ShieldCheck className="w-7 h-7 text-blue-600" />,
          title: "Magas szintű biztonság",
          description: "Titkosított tárolóegységeink és auditált hozzáférési rendszerünk garantálja eszközeitek biztonságát.",
          bgColor: "bg-blue-50"
        },
        {
          icon: <TrendingUp className="w-7 h-7 text-blue-600" />,
          title: "Tanulmányi eredmények javulása",
          description: "Partneriskoláinknál 42%-kal csökkent a figyelemzavar, 27%-kal javultak az átlagok.",
          bgColor: "bg-blue-50"
        },
        {
          icon: <Cpu className="w-7 h-7 text-blue-600" />,
          title: "Okos integrációk",
          description: "Kompatibilis az iskolai rendszerekkel, naplóprogramokkal és adminisztrációs szoftverekkel.",
          bgColor: "bg-blue-50"
        }
      ].map((feature, index) => (
        <div 
          key={index}
          className="group relative bg-white p-8 rounded-xl border border-gray-100 hover:border-blue-100 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className={`w-14 h-14 ${feature.bgColor} rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
            {/* <div className="mt-6">
              <span className="inline-flex items-center text-blue-600 font-medium text-sm">
                Tudjon meg többet
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div> */}
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

<section id="velemenyek" className="w-full py-16 bg-blue-600 text-white">
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
          quote: "Amióta bevezettük a telock rendszerét, jelentősen visszaesett az iskolánkban a mobiltelefonokkal kapcsolatos fegyelmi problémák száma.",
          author: "Kovács János, igazgató",
          school: "Budapesti Széchenyi Gimnázium"
        },
        {
          quote: "Végre egy olyan megoldás, ami tényleg működik és nem csak megnehezíti a tanáraink munkáját. A diákjaink is könnyen megtanulták használni.",
          author: "Nagy Edit, iskolavezető",
          school: "Debreceni Református Kollégium"
        },
        {
          quote: "Technikai támogatásuk kiváló, minden kérdésünkre gyorsan és szakmailag precízen válaszolnak. Profi a rendszerük!",
          author: "Tóth Béla, rendszergazda",
          school: "Pécsi Műszaki Szakközépiskola"
        }
      ].map((testimonial, index) => (
        <div key={index} className="bg-white/10 p-8 rounded-xl">
          <p className="italic mb-6 text-lg">"{testimonial.quote}"</p>
          <p className="font-bold">{testimonial.author}</p>
          <p className="text-blue-100">{testimonial.school}</p>
        </div>
      ))}
    </div>
  </div>
</section>

<section id="funkciok" className="w-full py-16 bg-gradient-to-b from-white to-gray-50">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 rounded-full mb-4">
        <span className="text-sm font-medium text-blue-600">Technológiai előnyök</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Fejlett <span className="text-blue-600">funkciók</span>
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
          description: 'Minden eszköz mozgása nyomon követhető a vezérlőpulton.',
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
        <div 
          key={index} 
          className="group relative bg-white p-8 rounded-xl border border-gray-100 hover:border-blue-100 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110">
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-900">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center text-blue-600 text-sm font-medium">
                Részletek
                <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

<section className="w-full py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
  <div className="max-w-4xl mx-auto px-6 text-center">
    <div className="relative inline-block mb-8">
      <div className="absolute -inset-4 bg-blue-500/30 rounded-xl blur-md animate-pulse"></div>
      <div className="relative bg-blue-700 px-6 py-3 rounded-lg">
        <span className="font-medium">Új lehetőség az iskoláknak</span>
      </div>
    </div>
    
    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
      Készen áll a <span className="text-blue-200">digitális fejlődésre</span>?
    </h2>
    
    <div className="max-w-2xl mx-auto mb-8">
      <p className="text-lg text-blue-100 mb-6">
        Írja be az email címét, és küldjük Önnek az ingyenes bemutató anyagot, valamint egy személyes konzultáció időpontot!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <input 
          type="email" 
          placeholder="iskola@minta.hu" 
          className="flex-1 px-4 py-3 rounded-lg border border-blue-400 bg-blue-500/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg whitespace-nowrap">
          Anyagot kérek
        </button>
      </div>
    </div>
    
    <div className="flex items-center justify-center gap-4 text-sm text-blue-200">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4" />
        <span>Ingyenes bemutató</span>
      </div>
      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4" />
        <span>Nem kötelező megrendelés</span>
      </div>
    </div>
  </div>
</section>

<footer className="w-full bg-gray-50 text-gray-800 py-12">
  <div className="max-w-7xl mx-auto px-6">
    <div className="grid md:grid-cols-3 gap-8 mb-8">
      <div className="space-y-4">
        <h3 className={`${ZenDots.className} text-2xl`}>telock</h3>
        <p className="text-gray-600">
        Fejlett megoldások a korszerű oktatásért.
        </p>
      </div>

      <div>
        <h4 className="font-bold mb-3">Linkek</h4>
        <ul className="space-y-2">
          <li><Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition">Vezérlőpult</Link></li>
          <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition">Dokumentáció</Link></li>
          <li><Link href="/api-docs" className="text-gray-600 hover:text-blue-600 transition">API Dokumentáció</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold mb-3">Kapcsolat</h4>
        <ul className="space-y-2 text-gray-600">
          <li>nagy.gabor@diak.szbi-pg.hu</li>
          <li>szalkai-szabo.adam@diak.szbi-pg.hu</li>
        </ul>
      </div>
    </div>

    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
      <p className="text-gray-500 mb-3 md:mb-0">
        © {new Date().getFullYear()} telock. Minden jog fenntartva.
      </p>
      <div className="flex gap-4">
        <Link href="#" className="text-gray-500 hover:text-blue-600">
          <span className="sr-only">Instagram</span>
          <Instagram className="w-5 h-5" />
        </Link>
        <Link href="#" className="text-gray-500 hover:text-blue-600">
          <span className="sr-only">YouTube</span>
          <Youtube className="w-5 h-5" />
        </Link>
      </div>
    </div>
  </div>
</footer>
    </div>
  );
}