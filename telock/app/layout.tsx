import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Logout from "./logout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "teLock",
  description: "Mobiltelefon tároló rendszer vezérlőpult",
};

interface User {
  short_name?: string;  // Define the structure of user with optional short_name
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  
  // TypeScript type assertion to ensure that session and session.user are defined
  const user = session?.user as User | undefined;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav>
          {!!session ? (
            <>
              {/* Check if user exists and then display short_name */}
              {user?.short_name && <span>Welcome, {user.short_name}</span>}
              <Logout />
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
}
