// app/layout.tsx
import { SessionProvider } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Az authOptions importálása

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions); // Session lekérése szerveroldalon

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}> {/* SessionProvider használata */}
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}