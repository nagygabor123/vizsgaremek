import Providers from "./providers";
import "./globals.css";

import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata = {
  title: "telock: Biztonságos és kényelmes telefontárolos iskoláknak",
  description: "telock: Biztonságos és kényelmes telefontárolos iskoláknak",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return ( 
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} >
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
