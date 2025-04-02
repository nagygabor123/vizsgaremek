import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import Providers from "./providers";
import { SidebarProvider } from "@/components/ui/sidebar";

import "./globals.css";

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
  title: "telock: Biztonságos és kényelmes telefontárolos iskoláknak",
  description: "telock: Biztonságos és kényelmes telefontárolos iskoláknak",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return ( 
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}