// app/layout.tsx
import { getServerSession } from "next-auth";
import type { Metadata } from "next";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
// import localFont from "next/font/local";
import Providers from "./providers"; // Importáld a Providers komponenst
import "./globals.css";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });


// import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono';


import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';


export const metadata: Metadata = {
  title: "telock",
  description: "Automatikus telefontároló rendszer",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions); // Session lekérése szerveroldalon

  return ( //className={`${geistSans.className} ${geistMono.className}`}
    <html lang="en"className={`${GeistSans.variable} ${GeistMono.variable}`} > 
      <body>
        <Providers session={session}> {/* Providers használata */}
          <div > {/* Példa: className="min-h-screen bg-gray-100" */}
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}