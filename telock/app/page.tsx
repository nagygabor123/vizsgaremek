import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <header className="w-full flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          {/*<Image src="/logo.png" alt="Logó" width={32} height={32} />*/}
          <span className="text-lg font-semibold">teLock</span>
        </div>
        <nav>
          <Link href="/">
            <Button variant="ghost">Kezdőlap</Button>
          </Link>
          <Link href="/login">
            <Button className="ml-2">Bejelentkezés</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Biztonságos és automatikus <span className="text-blue-600">telefontárolás</span> másodpercek alatt
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-6">
          Az teLock egy innovatív megoldás, amely lehetővé teszi, hogy gyorsan és biztonságosan tárold a telefonodat automatizált rendszerünk segítségével.
        </p>
        <div className="flex gap-4">
          <Button className="">Tárolás indítása</Button>
          <Button variant="outline" className="">Tudj meg többet</Button>
          <Button variant="outline" className="" onClick={() => window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}>
            Demo videó megtekintése
          </Button>
        </div>
      </main>

      {/* Új szekció: Szolgáltatás előnyei */}
      <section className="w-full py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Miért válaszd az teLock-ot?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Gyors és egyszerű</h3>
              <p className="text-gray-600">Csak néhány kattintás és a telefonod biztonságban van.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Magas szintű biztonság</h3>
              <p className="text-gray-600">Modern titkosítási technológiák garantálják adataid védelmét.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">24/7 elérhetőség</h3>
              <p className="text-gray-600">Bármikor hozzáférhetsz a tárolt eszközeidhez.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Új szekció: Gyakran Ismételt Kérdések (FAQ) */}
      <section className="w-full py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Gyakran Ismételt Kérdések</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Hogyan működik az teLock?</h3>
              <p className="text-gray-600">Az teLock egy automatizált rendszer, amely lehetővé teszi a telefonok gyors és biztonságos tárolását. Csatlakoztass egy eszközt, és a rendszer gondoskodik a többiről.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Mennyibe kerül a szolgáltatás?</h3>
              <p className="text-gray-600">Az teLock használata ingyenes az alapfunkciókra, de prémium csomagok is elérhetők további funkciókért.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Hol tárolják a telefonokat?</h3>
              <p className="text-gray-600">A telefonokat biztonságos, klimatizált létesítményekben tároljuk, amelyek folyamatos felügyelet alatt állnak.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full text-center p-4 text-gray-500">
        <p>&copy; 2025 teLock. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
}