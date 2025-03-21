// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Példa: Csak az "igazgató" pozícióval rendelkező felhasználók férhetnek hozzá a /dashboard/school/timetable oldalhoz
    if (req.nextUrl.pathname.startsWith("/dashboard/school")) {
      if (token?.position !== "igazgato") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Példa: Csak az osztályfőnökök férhetnek hozzá a /dashboard/class route-hoz
    if (req.nextUrl.pathname.startsWith("/dashboard/class")) {
      if (token?.osztalyfonok == "nincs") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Egyéb útvonalak kezelése
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Csak bejelentkezett felhasználók férhetnek hozzá
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"], // Middleware alkalmazása a /dashboard útvonal alatt
};