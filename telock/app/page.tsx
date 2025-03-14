
import Link from "next/link"


import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { BadgeCheck, LayoutGrid } from "lucide-react";
 import Logout from "./logout";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"
import localFont from "next/font/local";

const ZenDots = localFont({
  src: "./fonts/ZenDots-Regular.ttf",
  variable: "--font-zen-dots",
  weight: "100 900",
});

export default async function IndexPage() {
  // const stars = await getGitHubStars()
  const session = await getServerSession();
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <header className="container z-40 bg-background mx-auto">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="hidden items-center space-x-2 md:flex">
              <span className={`${ZenDots.className} text-xl`}>
                telock
              </span>
            </Link>
            <nav className="hidden gap-4 md:flex">
              <Button variant="link" className="text-muted-foreground" asChild>
                <Link href="#features">Funkciók</Link>
              </Button>
              <Button variant="link" className="text-muted-foreground" asChild>
                <Link href="#">Dokumentáció</Link>
              </Button>
            </nav>
          </div>
          <nav>
            {!!session &&
             <>
  <Button variant="secondary" size="icon" className="flex items-center"  asChild>
  <Link href="/dashboard"><LayoutGrid/></Link>
</Button>
              <Logout />
              </>
            }

            {!session &&

              <Button variant="secondary" asChild>
                <Link href="/login">Bejelentkezés</Link>
              </Button>
            }
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
              Biztonságos és kényelmes telefontárolás iskoláknak
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
                Bővebben
              </Link>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
              Funkciók
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              This project is an experiment to see how a modern app, with features
              like auth, subscriptions, API routes, and static pages would work in
              Next.js 13 app dir.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BadgeCheck className="w-12 h-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Next.js 13</h3>
                  <p className="text-sm text-muted-foreground">
                    App dir, Routing, Layouts, Loading UI and API routes.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BadgeCheck className="w-12 h-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">React 18</h3>
                  <p className="text-sm">
                    Server and Client Components. Use hook.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BadgeCheck className="w-12 h-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Database</h3>
                  <p className="text-sm text-muted-foreground">
                    ORM using Prisma and deployed on PlanetScale.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BadgeCheck className="w-12 h-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Components</h3>
                  <p className="text-sm text-muted-foreground">
                    UI components built using Radix UI and styled with Tailwind
                    CSS.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BadgeCheck className="w-12 h-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Authentication using NextAuth.js and middlewares.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <BadgeCheck className="w-12 h-12" />
                <div className="space-y-2">
                  <h3 className="font-bold">Subscriptions</h3>
                  <p className="text-sm text-muted-foreground">
                    Free and paid subscriptions using Stripe.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto text-center md:max-w-[58rem]">
            <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Taxonomy also includes a blog and a full-featured documentation site
              built using Contentlayer and MDX.
            </p>
          </div>
        </section>

        <section id="open-source" className=" py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
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
            {/* {stars && ( */}

            {/* )} */}
          </div>
        </section>


      </main>
      <footer>
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Az oldal vizsgaprojektként készült, fejlesztését Szalkai-Szabó Ádám és Nagy Gábor végezték.
          </p>
          <p className="text-sm md:text-right">© 2025</p>
        </div>
      </footer>

    </div>



  )
}