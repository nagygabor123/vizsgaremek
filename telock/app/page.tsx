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
      <section id="miert" className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Miért a Telock?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Innovatív megoldásaink egyedivé teszik rendszerünket az iskolai telefontárolás területén.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Katonai szintű biztonság',
                description: 'Titkosított tárolóegységeink garantálják eszközeitek biztonságát.',
                icon: <ShieldCheck className="w-7 h-7 text-blue-600" />
              },
              {
                title: 'Tanulmányi eredmények javulása',
                description: 'Partneriskoláinknál jelentős javulást mutattak az átlagok.',
                icon: <TrendingUp className="w-7 h-7 text-blue-600" />
              },
              {
                title: 'Okos integrációk',
                description: 'Kompatibilis az iskolai rendszerekkel és adminisztrációs szoftverekkel.',
                icon: <Cpu className="w-7 h-7 text-blue-600" />
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funkciok" className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Főbb előnyök
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Minden, amire egy modern iskolának szüksége lehet
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'RFID azonosítás diákigazolványokkal',
              'Valós idejű eszköz nyomonkövetés',
              'Többfaktoros tanári hitelesítés',
              'Automatikus szoftverfrissítések',
              'Skálázható több száz diákra',
              'Részletes használati jelentések'
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900">{feature}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rólunk mondták
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Csatlakozzon több mint 100 elégedett oktatási intézményhez
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "A Telock rendszer bevezetése óta drasztikusan csökkent a mobiltelefonok miatti fegyelmi incidensek.",
              "Végre egy olyan megoldás, ami tényleg működik és nem csak terhet ró a tanárainkra.",
              "Technikai támogatásuk kiváló, minden kérdésünkre gyorsan válaszolnak."
            ].map((quote, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <p className="italic text-gray-700 mb-6">"{quote}"</p>
                <div className="h-px bg-gray-200 mb-4"></div>
                <p className="text-sm text-gray-500">Partneriskolánk igazgatója</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Készen áll az iskolája változásra?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Kérjen egy személyre szabott bemutatót!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-800 hover:bg-gray-100">
              Bemutató kérése
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              Kapcsolat
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Telock</h3>
              <p className="text-gray-400">
                Innovatív megoldások a modern oktatás támogatására
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Linkek</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition">Főoldal</Link></li>
                <li><Link href="#miert" className="text-gray-400 hover:text-white transition">Előnyök</Link></li>
                <li><Link href="#funkciok" className="text-gray-400 hover:text-white transition">Funkciók</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kapcsolat</h4>
              <ul className="space-y-2 text-gray-400">
                <li>info@telock.hu</li>
                <li>+36 1 234 5678</li>
                <li>1037 Budapest, Fő utca 1.</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>© 2023 Telock. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>

</div>
  );
}