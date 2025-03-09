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
      {/* Fejléc */}
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="hidden items-center space-x-2 md:flex">
              <GalleryVerticalEnd />
              <span className="hidden font-bold sm:inline-block">teLock</span>
            </Link>
            <nav className="hidden gap-4 md:flex">
              <Button variant="link" className="text-muted-foreground" asChild>
                <Link href="/dashboard">Vezérlőpult</Link>
              </Button>
              <Button variant="link" className="text-muted-foreground" asChild>
                <Link href="/dashboard/school/logs">Dokumentáció</Link>
              </Button>
            </nav>
          </div>
          <nav>
            {!!session && <Logout />}
            {!session && (
              <Button variant="secondary" asChild>
                <Link href="/login">Bejelentkezés</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Fő tartalom */}
      <main className="flex-1 flex flex-col items-center">
        {/* Bevezető szakasz */}
        <section className="w-full space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
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

        {/* Funkciók szakasz */}
        <section id="features" className="w-full bg-slate-50 py-8 dark:bg-transparent">
          <div className="container flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Funkciók
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              This project is an experiment to see how a modern app, with features
              like auth, subscriptions, API routes, and static pages would work in
              Next.js 13 app dir.
            </p>
            <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
              {/* Funkciók tartalma */}
            </div>
          </div>
        </section>

        {/* Nyílt forráskód szakasz */}
        <section id="open-source" className="w-full py-8 md:py-12 lg:py-24">
          <div className="container flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Proudly Open Source
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Taxonomy is open source and powered by open source software. <br />{" "}
              The code is available on{" "}
              <Link
                href="/dashboard"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                GitHub
              </Link>
              .{" "}
            </p>
            <Link
              href="/dashboard"
              target="_blank"
              rel="noreferrer"
              className="flex"
            >
              <div className="flex h-10 w-10 items-center justify-center space-x-2 rounded-md border border-muted bg-muted">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-foreground"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                </svg>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-muted border-y-transparent"></div>
                <div className="flex h-10 items-center rounded-md border border-muted bg-muted px-4 font-medium">
                  dddddd
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Lábléc */}
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