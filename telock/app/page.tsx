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
        </div>
      </main>

      <footer className="w-full text-center p-4 text-gray-500">
        <p>&copy; 2025 teLock. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
}
