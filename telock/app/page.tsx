"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <header className="w-full flex justify-between items-center p-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          {/* <Image src="/logo.png" alt="Logó" width={32} height={32} className="dark:invert" /> */}
          <span className="text-lg font-semibold">teLock</span>
        </div>
        <nav className="flex items-center">
          <Link href="/">
            <Button variant="ghost">Kezdőlap</Button>
          </Link>
          <Link href="/login">
            <Button className="ml-2">Bejelentkezés</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Biztonságos és automatikus <span className="text-blue-600">telefontárolás</span> másodpercek alatt
          </h1>
        </motion.div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-6">
          Az teLock egy innovatív megoldás, amely lehetővé teszi, hogy gyorsan és biztonságosan tárold a telefonodat automatizált rendszerünk segítségével.
        </p>
        <div className="flex gap-4">
          <Button className="shadow-lg hover:shadow-xl transition-shadow duration-300">Tárolás indítása</Button>
          <Button variant="outline" className="hover:bg-blue-50 transition-colors duration-300">Tudj meg többet</Button>
        </div>
      </main>

      <section className="w-full py-12 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Miért válaszd az teLock-ot?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Gyors és Könnyű</h3>
              <p className="text-gray-600 dark:text-gray-300">Tárold a telefonodat másodpercek alatt.</p>
            </div>
            <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Biztonságos</h3>
              <p className="text-gray-600 dark:text-gray-300">Legmodernebb titkosítási technológiák.</p>
            </div>
            <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">Automatizált</h3>
              <p className="text-gray-600 dark:text-gray-300">Teljesen automatikus tárolási folyamat.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full text-center p-4 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>&copy; 2025 teLock. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
}