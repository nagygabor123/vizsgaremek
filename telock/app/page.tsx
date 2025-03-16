





import { useEffect } from "react";
import { Separator } from "@/components/ui/separator"
import Image from "next/image";
import { motion } from "framer-motion";
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



export default async function Home() {
  const session = await getServerSession();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-wrap justify-between items-center py-6 px-4">
      <span className={`${ZenDots.className} text-xl`}>
                telock
              </span>
        <nav className="hidden md:flex space-x-6 text-muted-foreground">
          <Link href="#">Why heexo?</Link>
          <Link href="#">Platform</Link>
          <Link href="#">Solutions</Link>
          <Link href="#">Changelog</Link>
        </nav>
      
        {!!session &&
             <>
  <Button variant="outline" className="px-4 py-2"  asChild>
  <Link href="/dashboard">Vezérlőpult</Link>
</Button>
              {/* <Logout /> */}
              </>
            }

            {!session &&

              <Button variant="outline" className="px-4 py-2" asChild>
                <Link href="/login">Bejelentkezés</Link>
              </Button>
            }
      </header>
      
      {/* Hero Section */}
      <section className="w-full max-w-6xl text-center my-12 px-4">
        <h2 className="text-3xl md:text-6xl font-bold">Biztonságos és kényelmes <span className="text-blue-600">telefontárolás</span> iskoláknak</h2>
     
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
          Hurree centralizes data from your entire tech stack and database creating one clea.
        </p>
        <Button className="mt-6 px-6 py-3">Kapcsolatfelvétel</Button>
      </section>
      
      {/* Illustration */}
      <div className="w-full max-w-5xl bg-gradient-to-r from-blue-100 to-white p-4 md:p-8 rounded-xl shadow">
      <Image src="/example.png" alt="Illustration" width={800} height={400} className="w-full h-auto" priority />

      </div>
      
      {/* Features */}
               <section
          id="features"
          className="space-y-6 bg-slate-50 py-8 md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-2xl font-bold leading-[1.1] sm:text-2xl md:text-4xl">
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
                <BadgeCheck className="w-12 h-12 text-blue-500" />
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
                <BadgeCheck className="w-12 h-12 text-blue-500" />
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
                <BadgeCheck className="w-12 h-12 text-blue-500" />
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
                <BadgeCheck className="w-12 h-12 text-blue-500" />
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
                <BadgeCheck className="w-12 h-12 text-blue-500" />
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
                <BadgeCheck className="w-12 h-12 text-blue-500" />
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


        <footer>
         <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
           <p className="text-center text-sm leading-loose md:text-left">
             Az oldal vizsgaprojektként készült, fejlesztését Nagy Gábor és Szalkai-Szabó Ádám végezték.
           </p>
           <p className="text-sm md:text-right">© 2025</p>
         </div>
       </footer>
    </div>
  );
}




// export default function Home() {
//   return (
//     <div className="container w-full max-w-none px-4 sm:px-6 lg:px-8">
      
//       <header className="container z-40 bg-background mx-auto">
        
//         <div className="flex h-20 items-center justify-between py-6">
//           <div className="flex gap-6 md:gap-10">
//             <Link href="/" className="hidden items-center space-x-2 md:flex">
//               <span className="text-xl">telock</span>
//             </Link>
//             <nav className="hidden gap-4 md:flex">
//               <Button variant="link" className="text-muted-foreground" asChild>
//                 <Link href="#features">Funciók</Link>
//               </Button>
//               <Button variant="link" className="text-muted-foreground" asChild>
//                 <Link href="#">Dokumentáció</Link>
//               </Button>
//             </nav>
//           </div>
//           <nav className="flex items-center gap-4">
//   <Button variant="secondary" size="icon" className="flex items-center"  asChild>
//     <Link href="/dashboard"><LayoutGrid/></Link>
//   </Button>
//   <Button variant="secondary" asChild>
//     <Link href="/login">Bejelentkezés</Link>
//   </Button>
  
// </nav>

//         </div>
//       </header>
//       <main className="flex-1">
//       <section className="relative space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 overflow-visible">
//       <div className="absolute inset-0 pointer-events-none">
//   <div className="background">
//     {[...Array(10)].map((_, index) => (
//       <div key={index} className={`pie ${["astronaut", "greenpea", "greenpea2", "cello", "wineberry"][index % 5]}`}></div>
//     ))}
//   </div>

// </div>



//   <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center relative z-10">
//     <h1 className="font-heading text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
//       Biztonságos és kényelmes <span className="text-blue-600">telefontárolás</span> iskoláknak
//     </h1>
//     <p className="max-w-[42rem] leading-normal  sm:text-xl sm:leading-8">
//       Csökkentsük a figyelemelterelést és biztosítsuk a diákok számára a zavartalan tanulást!
//     </p>
//     <div className="space-x-4">
//     <Button asChild>
//       <Link href="/login">Kapcsolatfelvétel</Link>
//       </Button>
//       <Button variant="outline" asChild>
//       <Link href="/dashboard" target="_blank" rel="noreferrer">
//         Bővebben
//       </Link>
//       </Button>
//     </div>
//   </div>
// </section>

//         {/* <Separator /> */}

//         <section
//           id="features"
//           className="space-y-6 bg-slate-50 py-8 md:py-12 bg-white lg:py-24"
//         >
//           <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
//             <h2 className="font-heading text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">
//               Funkciók
//             </h2>
//             <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
//               This project is an experiment to see how a modern app, with features
//               like auth, subscriptions, API routes, and static pages would work in
//               Next.js 13 app dir.
//             </p>
//           </div>
//           <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
//             <div className="relative overflow-hidden rounded-lg border bg-background p-2">
//               <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
//                 <BadgeCheck className="w-12 h-12" />
//                 <div className="space-y-2">
//                   <h3 className="font-bold">Next.js 13</h3>
//                   <p className="text-sm text-muted-foreground">
//                     App dir, Routing, Layouts, Loading UI and API routes.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="relative overflow-hidden rounded-lg border bg-background p-2">
//               <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
//                 <BadgeCheck className="w-12 h-12" />
//                 <div className="space-y-2">
//                   <h3 className="font-bold">React 18</h3>
//                   <p className="text-sm">
//                     Server and Client Components. Use hook.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="relative overflow-hidden rounded-lg border bg-background p-2">
//               <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
//                 <BadgeCheck className="w-12 h-12" />
//                 <div className="space-y-2">
//                   <h3 className="font-bold">Database</h3>
//                   <p className="text-sm text-muted-foreground">
//                     ORM using Prisma and deployed on PlanetScale.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="relative overflow-hidden rounded-lg border bg-background p-2">
//               <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
//                 <BadgeCheck className="w-12 h-12" />
//                 <div className="space-y-2">
//                   <h3 className="font-bold">Components</h3>
//                   <p className="text-sm text-muted-foreground">
//                     UI components built using Radix UI and styled with Tailwind
//                     CSS.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="relative overflow-hidden rounded-lg border bg-background p-2">
//               <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
//                 <BadgeCheck className="w-12 h-12" />
//                 <div className="space-y-2">
//                   <h3 className="font-bold">Authentication</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Authentication using NextAuth.js and middlewares.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="relative overflow-hidden rounded-lg border bg-background p-2">
//               <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
//                 <BadgeCheck className="w-12 h-12" />
//                 <div className="space-y-2">
//                   <h3 className="font-bold">Subscriptions</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Free and paid subscriptions using Stripe.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="mx-auto text-center md:max-w-[58rem]">
//             <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
//               Taxonomy also includes a blog and a full-featured documentation site
//               built using Contentlayer and MDX.
//             </p>
//           </div>
//         </section>
//         <Separator />

//         <section id="open-source" className=" py-8 md:py-12 lg:py-24">
//         <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-center">
//       <img
//         src="https://mockuphone.com/images/devices_picture/apple-macbookpro14-front.png"
//         alt="MacBook Pro 14"
//         className="w-[300px] sm:w-[500px]"
//       />
//       <img
//         src="https://mockuphone.com/images/devices_picture/apple-iphone13-blue-portrait.png"
//         alt="iPhone 13 Blue"
//         className="w-[150px] sm:w-[200px]"
//       />
//     </div>
//           <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
//             <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
//               Proudly Open Source
//             </h2>
//             <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
//               Taxonomy is open source and powered by open source software. <br />{" "}
//               The code is available on{" "}
//               <Link
//                 href="/dashboard"
//                 target="_blank"
//                 rel="noreferrer"
//                 className="underline underline-offset-4"
//               >
//                 GitHub
//               </Link>
//               .{" "}
//             </p>
//             {/* {stars && ( */}

//             {/* )} */}
//           </div>
//         </section>


//       </main>
//       <footer>
//         <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
//           <p className="text-center text-sm leading-loose md:text-left">
//             Az oldal vizsgaprojektként készült, fejlesztését Nagy Gábor és Szalkai-Szabó Ádám végezték.
//           </p>
//           <p className="text-sm md:text-right">© 2025</p>
//         </div>
//       </footer>

//     </div>
//   );
// }



