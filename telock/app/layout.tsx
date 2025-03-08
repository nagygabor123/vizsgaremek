// app/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import Providers from "./providers"; // Importáld a Providers komponenst
import "./globals.css";



export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions); // Session lekérése szerveroldalon

  return (
    <html lang="en">
      <body>
        <Providers session={session}> {/* Providers használata */}
          <div className="min-h-screen bg-gray-100"> {/* Példa: Törzs stílusok */}
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}