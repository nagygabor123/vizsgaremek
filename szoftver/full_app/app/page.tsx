import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <header className="w-full flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
         {/* <Image src="/logo.png" alt="Logo" width={32} height={32} />*/}
          <span className="text-lg font-semibold">teLock</span>
        </div>
        <nav>
          <Link href="#">
            <Button variant="ghost">Kezdőlap</Button>
          </Link>
          <Link href="/login">
            <Button className="ml-2">Bejelentkezés</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          sdfdsfsdf sdf sdfsdf <span className="text-blue-600">sdfsdf dfsdf sdf</span> sdf sdfsdf
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mb-6">
          sdfsdf df dsf fSDf dfsdf dsf sdfdsfsdfsdf dfsdf df sdfsdf df sdfsdfsfsdff
        </p>
        <div className="flex gap-4">
          <Button className="">Ffsdf fdfdsf f sdf</Button>
          <Button variant="outline" className="">Tudj meg többet</Button>
        </div>
      </main>
    </div>
  );
}
