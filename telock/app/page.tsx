import Link from "next/link"


import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"



export default async function IndexPage() {
  // const stars = await getGitHubStars()

  return (
    <div className="flex min-h-screen flex-col">
    <header className="container z-40 bg-background">
      <div className="flex h-20 items-center justify-between py-6">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">CCCC</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/" className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm">
              fasz
            </Link>
          </nav>
        </div>
        <nav>
          <Link href="/login" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "px-4")}>
            Login
          </Link>
        </nav>
      </div>
    </header>
    <main className="flex-1 flex flex-col items-center">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 flex flex-col items-center">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <Link href="a" className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium" target="_blank">
            Follow along on Twitter
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            An example app built using Next.js 13 server components.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            I&apos;m building a web app with Next.js 13 and open sourcing everything. Follow along as we figure this out together.
          </p>
          <div className="space-x-4">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link href="a" target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              GitHub
            </Link>
          </div>
        </div>
      </section>
      {/* További szekciók */}
    </main>
    <footer className="flex flex-col items-center justify-center py-10">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a href="{siteConfig.links.twitter}" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              shadcn
            </a>
            . Hosted on{" "}
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              Vercel
            </a>
            . Illustrations by{" "}
            <a href="https://popsy.co" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              Popsy
            </a>
            . The source code is available on{" "}
            <a href="{siteConfig.links.github}" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-4">
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  </div>

   
  )
}