"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-md z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <span className="text-lg font-semibold">teLock</span>
          <nav className="flex items-center">
            <Link href="/dashboard">
              <Button variant="ghost">Vezérlőpult</Button>
            </Link>
            <Link href="/login">
              <Button className="ml-2">Bejelentkezés</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center mt-20 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Biztonságos és automatikus <span className="text-blue-600">telefontárolás</span>
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

      <section className="w-full py-20 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Miért válaszd az teLock-ot?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Gyors és Könnyű", desc: "Tárold a telefonodat másodpercek alatt." },
              { title: "Biztonságos", desc: "Legmodernebb titkosítási technológiák." },
              { title: "Automatizált", desc: "Teljesen automatikus tárolási folyamat." },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-blue-50 dark:bg-gray-700 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-100 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Hogyan működik?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Helyezd be", desc: "Tedd a telefonodat a tárolóba." },
              { step: "02", title: "Automatikus lezárás", desc: "A rendszer felismeri és biztonságosan elzárja." },
              { step: "03", title: "Biztonságos hozzáférés", desc: "Csak te férhetsz hozzá a telefonodhoz." },
            ].map((item, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md flex flex-col items-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full text-center p-6 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>&copy; 2025 teLock. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
}
