import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { GalleryVerticalEnd } from "lucide-react"
import Logout from "./logout"
import { getServerSession } from "next-auth"
import { Button } from "@/components/ui/button"

export default async function IndexPage() {
  const session = await getServerSession()
  return (
    <div className="flex min-h-screen flex-col">
<header className="w-full flex justify-center items-center py-4 bg-gray-800">
  <nav className="container flex justify-center items-center">
    <ul className="flex space-x-8 text-white">
      <li><Link href="/">Kezdőlap</Link></li>
      <li><Link href="/about">Rólunk</Link></li>
      <li><Link href="/services">Szolgáltatások</Link></li>
      <li><Link href="/contact">Kapcsolat</Link></li>
    </ul>
  </nav>
</header>
      <main className="flex-1 flex justify-center items-center flex-col">
  <section className="w-full flex justify-center items-center space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
      <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
        Biztonságos és kényelmes telefontárolás iskolák számára
      </h1>
      <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
        Csökkentsük a figyelemelterelést és biztosítsuk a diákok számára a zavartalan tanulást!
      </p>
      <div className="space-x-4">
        <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
          Kapcsolatfelvétel
        </Link>
        <Link
          href="/dashboard"
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Demo videó megtekintése
        </Link>
      </div>
    </div>
  </section>
</main>

      <footer>
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose md:text-left">
              Az oldal vizsgaprojektként készült, fejlesztését Nagy Gábor és Szalkai-Szabó Ádám végezték. A forráskód elérhető a
              <a
                href="https://github.com/nagygabor123/vizsgaremek.git"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                Github
              </a>-on
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}